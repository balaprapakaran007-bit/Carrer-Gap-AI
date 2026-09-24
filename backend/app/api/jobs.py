import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException
from typing import List
from app.models.schemas import JobCreateRequest, JobURLFetchRequest, JobURLFetchResponse, JobModel
from app.services.job_parser import job_parser
from app.services.job_url_fetcher import job_url_fetcher
from app.services.firebase_service import firebase_service

router = APIRouter(prefix="/jobs", tags=["Jobs"])

@router.post("", response_model=JobModel)
async def create_job(payload: JobCreateRequest):
    """Creates a job description and extracts requirements."""
    requirements = await job_parser.parse_with_ai(payload.title, payload.description)
    job_id = str(uuid.uuid4())
    
    job_model = JobModel(
        id=job_id,
        userId="demo_user",
        title=payload.title,
        company=payload.company or "Target Company",
        description=payload.description,
        requirements=requirements,
        sourceUrl=payload.sourceUrl,
        createdAt=datetime.utcnow().isoformat()
    )
    firebase_service.save_job(job_model)
    return job_model

@router.post("/from-url", response_model=JobURLFetchResponse)
async def fetch_job_from_url(payload: JobURLFetchRequest):
    """Safely extracts job description text from a job posting URL."""
    try:
        data = await job_url_fetcher.fetch_job_content(payload.url)
        extracted = data["extractedText"]
        reqs = job_parser.extract_heuristics(extracted)
        return JobURLFetchResponse(
            url=payload.url,
            title=data["title"],
            company=data["company"],
            extractedText=extracted,
            detectedRequirementsCount=len(reqs)
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("", response_model=List[JobModel])
async def list_jobs():
    """Lists stored job descriptions."""
    return firebase_service.list_jobs("demo_user")

@router.get("/{id}", response_model=JobModel)
async def get_job(id: str):
    """Fetches job by ID."""
    job = firebase_service.get_job(id)
    if not job:
        raise HTTPException(status_code=404, detail="Job description not found.")
    return job
