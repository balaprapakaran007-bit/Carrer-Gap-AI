from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any, List
from app.models.schemas import ProjectGapItem
from app.services.gap_engine import gap_engine

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.post("/generate", response_model=List[ProjectGapItem])
async def generate_projects(payload: Dict[str, Any] = Body(...)):
    """Generates project plans targeting missing skills."""
    missing_skills = payload.get("missingSkills", ["Docker", "FastAPI"])
    target_role = payload.get("targetRole", "Machine Learning Engineer")
    
    projects = await gap_engine.generate_projects_with_ai(missing_skills, target_role)
    return projects
