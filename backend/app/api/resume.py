import uuid
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List, Optional
from app.models.schemas import ResumeUploadResponse, ResumeModel
from app.services.resume_parser import resume_parser
from app.services.firebase_service import firebase_service

router = APIRouter(prefix="/resumes", tags=["Resumes"])

@router.post("/upload", response_model=ResumeUploadResponse)
async def upload_resume(
    file: Optional[UploadFile] = File(None),
    rawText: Optional[str] = Form(None),
    fileName: Optional[str] = Form(None)
):
    """Uploads and parses a candidate resume (PDF or text)."""
    if file:
        content = await file.read()
        name = file.filename or "uploaded_resume.pdf"
        try:
            extracted_text = resume_parser.parse_file(content, name)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"We couldn't extract readable text from this file ({name}). {str(e)}")
    elif rawText and len(rawText.strip()) > 10:
        extracted_text = rawText.strip()
        name = fileName or "Pasted_Resume.txt"
    else:
        raise HTTPException(status_code=400, detail="Please upload a PDF or DOCX resume or provide resume text.")

    detected_skills = resume_parser.extract_detected_skills(extracted_text)
    resume_id = str(uuid.uuid4())
    
    resume_model = ResumeModel(
        id=resume_id,
        userId="demo_user",
        fileName=name,
        storagePath=f"/resumes/{name}",
        parsedText=extracted_text,
        skills=detected_skills,
        version=1,
        createdAt=datetime.utcnow().isoformat()
    )
    firebase_service.save_resume(resume_model)

    return ResumeUploadResponse(
        id=resume_id,
        fileName=name,
        extractedText=extracted_text,
        detectedSkills=detected_skills,
        version=1,
        createdAt=resume_model.createdAt
    )

@router.get("", response_model=List[ResumeModel])
async def list_resumes():
    """Lists all stored resumes for current user."""
    return firebase_service.list_resumes("demo_user")

@router.get("/{id}", response_model=ResumeModel)
async def get_resume(id: str):
    """Fetches a specific parsed resume by ID."""
    resume = firebase_service.get_resume(id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found.")
    return resume
