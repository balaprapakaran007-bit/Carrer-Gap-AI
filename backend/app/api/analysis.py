import json
import uuid
import asyncio
import logging
from datetime import datetime
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from typing import List, Dict, Any, AsyncGenerator
from app.models.schemas import (
    AnalysisCreateRequest, FullAnalysisResult, AnalysisCompareResponse,
    MultiJobCompareRequest, MultiJobCompareResponse, RequirementItem
)
from app.services.resume_parser import resume_parser
from app.services.job_parser import job_parser
from app.services.matching_engine import matching_engine
from app.services.embedding_service import embedding_service
from app.services.firebase_service import firebase_service

logger = logging.getLogger("careergap.api.analysis")
router = APIRouter(prefix="/analysis", tags=["Analysis"])

async def _resolve_inputs(payload: AnalysisCreateRequest):
    """
    Resolves resume competencies and job requirements concurrently for maximum throughput.
    """
    async def get_resume_data():
        if payload.resumeId:
            resume = firebase_service.get_resume(payload.resumeId)
            if not resume:
                raise HTTPException(status_code=404, detail="Selected resume not found.")
            return resume.parsedText, resume.skills
        elif payload.resumeText:
            return payload.resumeText, resume_parser.extract_detected_skills(payload.resumeText)
        else:
            analysis = firebase_service.get_analysis("demo-analysis-ml-01")
            if analysis:
                return "Demo Resume", ["Python", "PyTorch", "SQL", "Machine Learning"]
            raise HTTPException(status_code=400, detail="Please provide resume information.")

    async def get_job_data():
        if payload.jobId:
            job = firebase_service.get_job(payload.jobId)
            if not job:
                raise HTTPException(status_code=404, detail="Selected job description not found.")
            return job.requirements, job.title, job.company or "Target Company"
        elif payload.jobText:
            j_title = payload.jobTitle or "Target Role"
            j_company = payload.jobCompany or "Target Company"
            j_reqs = await job_parser.parse_with_ai(j_title, payload.jobText)
            return j_reqs, j_title, j_company
        else:
            analysis = firebase_service.get_analysis("demo-analysis-ml-01")
            if analysis:
                return analysis.requirements, analysis.jobTitle, analysis.jobCompany
            raise HTTPException(status_code=400, detail="Please provide job description.")

    # Run resume extraction and job requirement parsing concurrently
    (resume_text, detected_skills), (requirements, job_title, job_company) = await asyncio.gather(
        get_resume_data(),
        get_job_data()
    )

    return resume_text, detected_skills, requirements, job_title, job_company

@router.post("", response_model=FullAnalysisResult)
async def create_analysis(payload: AnalysisCreateRequest):
    """Generates complete AI Career Gap analysis with concurrent stage processing."""
    resume_text, detected_skills, requirements, job_title, job_company = await _resolve_inputs(payload)

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

@router.post("/stream")
async def create_analysis_stream(payload: AnalysisCreateRequest):
    """
    Server-Sent Events endpoint streaming real-time stage progress to the frontend:
    - Stage 1: Resume parsed
    - Stage 2: Job requirements extracted
    - Stage 3: Skills compared & scored
    - Stage 4: Evidence citations checked
    - Stage 5: Roadmap generated
    - Stage 6: Final result emitted
    """
    async def event_generator() -> AsyncGenerator[str, None]:
        queue: asyncio.Queue = asyncio.Queue()

        async def stage_callback(stage_id: str, message: str, step: int, total: int):
            await queue.put({
                "type": "stage",
                "stage": stage_id,
                "message": message,
                "step": step,
                "total": total
            })

        async def run_pipeline():
            try:
                # Stage 1: Resume parsed
                await stage_callback("resume_parsed", "Resume parsed and skills detected", 1, 5)

                # Stage 2: Job requirements extracted
                resume_text, detected_skills, requirements, job_title, job_company = await _resolve_inputs(payload)
                await stage_callback("requirements_extracted", "Job requirements and priority levels extracted", 2, 5)

                # Stages 3-5: Matching, Evidence & Roadmap
                result = await matching_engine.analyze(
                    resume_text=resume_text,
                    detected_skills=detected_skills,
                    job_requirements=requirements,
                    job_title=job_title,
                    job_company=job_company,
                    resume_id=payload.resumeId,
                    job_id=payload.jobId,
                    progress_callback=stage_callback
                )

                firebase_service.save_analysis(result)

                # Final emission
                await queue.put({
                    "type": "complete",
                    "stage": "completed",
                    "message": "Analysis successfully completed",
                    "step": 5,
                    "total": 5,
                    "result": result.model_dump() if hasattr(result, "model_dump") else result.dict()
                })
            except Exception as e:
                logger.error(f"Error in streaming analysis: {str(e)}")
                await queue.put({
                    "type": "error",
                    "stage": "failed",
                    "message": str(e) or "An error occurred during analysis generation"
                })
            finally:
                await queue.put(None)  # Sentinel to end stream

        pipeline_task = asyncio.create_task(run_pipeline())

        while True:
            item = await queue.get()
            if item is None:
                break
            yield f"data: {json.dumps(item)}\n\n"

        await pipeline_task

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )

@router.get("", response_model=List[FullAnalysisResult])
async def list_analyses():
    """Lists all saved analyses."""
    return firebase_service.list_analyses("demo_user")

@router.get("/{id}", response_model=FullAnalysisResult)
async def get_analysis(id: str):
    """Retrieves an analysis by ID."""
    analysis = firebase_service.get_analysis(id)
    if not analysis:
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
            is_matched = any(embedding_service.calculate_skill_similarity(cand, s) >= 0.75 for cand in candidate_skills)
            if not is_matched:
                job_missing.append(s)
                gap_frequency[s] = gap_frequency.get(s, 0) + 1

        all_job_skills[title] = job_req_skills
        job_gaps_map[title] = job_missing

    common_skills = []
    for cand in candidate_skills:
        if sum(1 for req_set in all_job_skills.values() if any(embedding_service.calculate_skill_similarity(cand, s) > 0.7 for s in req_set)) >= max(1, len(payload.jobDescriptions) - 1):
            common_skills.append(cand)

    common_gaps = [skill for skill, count in gap_frequency.items() if count >= 2]
    if not common_gaps and gap_frequency:
        common_gaps = list(gap_frequency.keys())[:3]

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
