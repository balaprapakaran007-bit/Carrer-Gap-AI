from fastapi import APIRouter, HTTPException, Body
from typing import List, Dict, Any
from app.models.schemas import RoadmapStepItem
from app.services.firebase_service import firebase_service

router = APIRouter(prefix="/roadmap", tags=["Roadmap"])

@router.get("/{id}", response_model=List[RoadmapStepItem])
async def get_roadmap(id: str):
    """Fetches roadmap steps for an analysis."""
    analysis = firebase_service.get_analysis(id) or firebase_service.get_analysis("demo-analysis-ml-01")
    if not analysis:
        raise HTTPException(status_code=404, detail="Roadmap not found.")
    return analysis.roadmap

@router.patch("/{id}/step")
async def toggle_step_completion(id: str, payload: Dict[str, Any] = Body(...)):
    """Marks a roadmap step as completed or incomplete and updates streaks/badges."""
    step_id = payload.get("stepId")
    is_completed = payload.get("isCompleted", True)

    analysis = firebase_service.get_analysis(id) or firebase_service.get_analysis("demo-analysis-ml-01")
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found.")

    found = False
    for step in analysis.roadmap:
        if step.id == step_id:
            step.isCompleted = is_completed
            found = True
            break

    if not found and analysis.roadmap:
        analysis.roadmap[0].isCompleted = is_completed

    firebase_service.save_analysis(analysis)

    # Update streak
    streak = firebase_service.get_streak("demo_user")
    completed_steps = sum(1 for s in analysis.roadmap if s.isCompleted)
    streak.roadmapStepsCompleted = completed_steps
    if is_completed:
        streak.currentStreakDays += 1
        # Award badge if not already awarded
        badge_ids = [b["id"] for b in streak.earnedBadges]
        if "roadmap_step_1" not in badge_ids:
            streak.earnedBadges.append({
                "id": "roadmap_step_1",
                "name": "First Step Conquered",
                "icon": "🎯",
                "desc": "Completed a personalized roadmap milestone"
            })
    firebase_service.update_streak("demo_user", streak)

    return {
        "success": True,
        "stepId": step_id,
        "isCompleted": is_completed,
        "completedCount": completed_steps,
        "streak": streak
    }
