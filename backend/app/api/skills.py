from datetime import datetime
from fastapi import APIRouter, Body
from typing import List, Dict, Any
from app.models.schemas import SkillProgressItem, StreakInfo, SkillStatus
from app.services.firebase_service import firebase_service

router = APIRouter(prefix="/skills", tags=["Skills Progress & Streaks"])

@router.get("/progress")
async def get_skill_progress() -> Dict[str, Any]:
    """Returns candidate skill progress list and streak information."""
    streak = firebase_service.get_streak("demo_user")
    
    # Pre-populate with verified demo skills
    skills = [
        {"skill": "Python", "status": "Matched", "progressPercent": 100, "category": "Programming"},
        {"skill": "SQL", "status": "Matched", "progressPercent": 95, "category": "Data Engineering"},
        {"skill": "Machine Learning", "status": "Matched", "progressPercent": 90, "category": "AI / ML"},
        {"skill": "PyTorch", "status": "Matched", "progressPercent": 85, "category": "AI / ML"},
        {"skill": "FastAPI", "status": "Weak", "progressPercent": 40, "category": "Backend"},
        {"skill": "Docker", "status": "Missing", "progressPercent": 20, "category": "DevOps"},
        {"skill": "Amazon Web Services (AWS)", "status": "Weak", "progressPercent": 35, "category": "Cloud"}
    ]
    return {
        "skills": skills,
        "streak": streak
    }

@router.post("/progress")
async def update_skill_progress(payload: Dict[str, Any] = Body(...)):
    """Updates candidate progress on a skill."""
    skill_name = payload.get("skill")
    progress = payload.get("progressPercent", 50)
    status = payload.get("status", "Weak")

    streak = firebase_service.get_streak("demo_user")
    if progress >= 80:
        badge_ids = [b["id"] for b in streak.earnedBadges]
        badge_id = f"badge_{skill_name.lower().replace(' ', '_')}"
        if badge_id not in badge_ids:
            streak.earnedBadges.append({
                "id": badge_id,
                "name": f"{skill_name} Practitioner",
                "icon": "⚡",
                "desc": f"Achieved 80%+ verified proficiency in {skill_name}"
            })
            firebase_service.update_streak("demo_user", streak)

    return {
        "success": True,
        "skill": skill_name,
        "progressPercent": progress,
        "status": status,
        "streak": streak
    }
