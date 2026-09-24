import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.models.schemas import (
    AnalysisCreateRequest, FullAnalysisResult, AnalysisCompareResponse,
    MultiJobCompareRequest, MultiJobCompareResponse
)
from app.services.resume_parser import resume_parser
from app.services.job_parser import job_parser
from app.services.matching_engine import matching_engine
from app.services.embedding_service import embedding_service
from app.services.firebase_service import firebase_service

router = APIRouter(prefix="/analysis", tags=["Analysis"])

@router.post("", response_model=FullAnalysisResult)
async def create_analysis(payload: AnalysisCreateRequest):
    """Generates complete AI Career Gap analysis."""
    # 1. Resolve Resume Text
    if payload.resumeId:
        resume = firebase_service.get_resume(payload.resumeId)
        if not resume:
            raise HTTPException(status_code=404, detail="Selected resume not found.")
        resume_text = resume.parsedText
        detected_skills = resume.skills
    elif payload.resumeText:
        resume_text = payload.resumeText
        detected_skills = resume_parser.extract_detected_skills(resume_text)
    else:
        # If demo mode
        analysis = firebase_service.get_analysis("demo-analysis-ml-01")
        if analysis:
            return analysis
        raise HTTPException(status_code=400, detail="Please provide resume information.")

    # 2. Resolve Job Requirements
    if payload.jobId:
        job = firebase_service.get_job(payload.jobId)
        if not job:
            raise HTTPException(status_code=404, detail="Selected job description not found.")
        requirements = job.requirements
        job_title = job.title
        job_company = job.company or "Target Company"
    elif payload.jobText:
        job_title = payload.jobTitle or "Target Role"
        job_company = payload.jobCompany or "Company"
        requirements = await job_parser.parse_with_ai(job_title, payload.jobText)
    else:
        # Fallback to demo
        analysis = firebase_service.get_analysis("demo-analysis-ml-01")
        if analysis:
            return analysis
        raise HTTPException(status_code=400, detail="Please provide job description.")

    # 3. Perform explainable matching and analysis
    analysis_result = await matching_engine.analyze(
        resume_text=resume_text,
        detected_skills=detected_skills,
        job_requirements=requirements,
        job_title=job_title,
        job_company=job_company,
        resume_id=payload.resumeId,
        job_id=payload.jobId
    )

    firebase_service.save_analysis(analysis_result)
    return analysis_result

@router.get("", response_model=List[FullAnalysisResult])
async def list_analyses():
    """Lists all saved analyses."""
    return firebase_service.list_analyses("demo_user")

@router.get("/{id}", response_model=FullAnalysisResult)
async def get_analysis(id: str):
    """Retrieves an analysis by ID."""
    analysis = firebase_service.get_analysis(id)
    if not analysis:
        # Check demo
        if id.startswith("demo"):
            analysis = firebase_service.get_analysis("demo-analysis-ml-01")
        if not analysis:
            raise HTTPException(status_code=404, detail="Analysis not found.")
    return analysis

@router.get("/{id}/compare", response_model=AnalysisCompareResponse)
async def compare_analysis(id: str, previousId: str = "demo-analysis-ml-01"):
    """Compares current analysis with a previous version to show score and evidence progress."""
    current = firebase_service.get_analysis(id) or firebase_service.get_analysis("demo-analysis-ml-01")
    previous = firebase_service.get_analysis(previousId) or current

    diff = round(current.readinessScore - previous.readinessScore, 1)
    
    improved = []
    for skill_item in current.skillsMatrix:
        if skill_item.status.value == "Matched":
            improved.append({
                "skill": skill_item.skill,
                "previousStatus": "Weak / Missing",
                "currentStatus": "Matched",
                "currentEvidence": skill_item.evidenceLevel.value
            })

    return AnalysisCompareResponse(
        previousAnalysisId=previous.id,
        currentAnalysisId=current.id,
        previousScore=previous.readinessScore,
        currentScore=current.readinessScore,
        scoreDiff=diff,
        improvedSkills=improved[:4],
        remainingGaps=[s.skill for s in current.skillsMatrix if s.status.value == "Missing"]
    )

@router.post("/multi-compare", response_model=MultiJobCompareResponse)
async def compare_multiple_jobs(payload: MultiJobCompareRequest):
    """Compares candidate against multiple jobs to find common skills, common gaps, and highest-leverage skill to learn."""
    candidate_skills = set(resume_parser.extract_detected_skills(payload.resumeText))
    
    job_gaps_map: Dict[str, List[str]] = {}
    gap_frequency: Dict[str, int] = {}
    all_job_skills: Dict[str, set] = {}

    for job_info in payload.jobDescriptions:
        title = job_info.get("title", "Job Role")
        desc = job_info.get("description", "")
        reqs = job_parser.extract_heuristics(desc)
        job_req_skills = set()
        job_missing = []

        for req in reqs:
            s = embedding_service.normalize_skill(req.requirement.split()[-1])
            job_req_skills.add(s)
            # Check match
            is_matched = any(embedding_service.calculate_skill_similarity(cand, s) >= 0.75 for cand in candidate_skills)
            if not is_matched:
                job_missing.append(s)
                gap_frequency[s] = gap_frequency.get(s, 0) + 1

        all_job_skills[title] = job_req_skills
        job_gaps_map[title] = job_missing

    # Common skills across all or most jobs
    common_skills = []
    for cand in candidate_skills:
        if sum(1 for req_set in all_job_skills.values() if any(embedding_service.calculate_skill_similarity(cand, s) > 0.7 for s in req_set)) >= max(1, len(payload.jobDescriptions) - 1):
            common_skills.append(cand)

    # Common gaps (missing in 2 or more jobs)
    common_gaps = [skill for skill, count in gap_frequency.items() if count >= 2]
    if not common_gaps and gap_frequency:
        common_gaps = list(gap_frequency.keys())[:3]

    # Highest-leverage skill to learn next
    sorted_leverage = sorted(gap_frequency.items(), key=lambda x: x[1], reverse=True)
    highest_leverage = [
        {
            "skill": skill,
            "unblocksJobsCount": count,
            "totalJobs": len(payload.jobDescriptions),
            "recommendation": f"Learning {skill} would move you closer to readiness across {count} of your {len(payload.jobDescriptions)} tracked roles."
        }
        for skill, count in sorted_leverage[:3]
    ]

    return MultiJobCompareResponse(
        commonSkills=common_skills[:8],
        commonGaps=common_gaps[:6],
        roleSpecificGaps=job_gaps_map,
        highestLeverageSkills=highest_leverage
    )
