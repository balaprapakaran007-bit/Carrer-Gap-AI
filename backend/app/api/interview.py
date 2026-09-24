from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any
from app.models.schemas import InterviewSessionCreateRequest, InterviewAnswerSubmitRequest, InterviewSessionModel
from app.services.interview_engine import interview_engine
from app.services.firebase_service import firebase_service

router = APIRouter(prefix="/interview", tags=["Mock Interview"])

@router.post("/generate", response_model=InterviewSessionModel)
async def generate_interview_session(payload: InterviewSessionCreateRequest):
    """Generates a role-tailored mock interview session."""
    session = await interview_engine.generate_interview_session(
        analysis_id=payload.analysisId,
        role_title=payload.roleTitle,
        matched_skills=payload.matchedSkills,
        gap_skills=payload.gapSkills
    )
    firebase_service.save_interview_session(session)
    return session

@router.get("/{id}", response_model=InterviewSessionModel)
async def get_interview_session(id: str):
    """Fetches an existing interview session."""
    session = firebase_service.get_interview_session(id)
    if not session:
        # Generate default session if not found
        session = await interview_engine.generate_interview_session(
            analysis_id=id,
            role_title="Machine Learning Engineer",
            matched_skills=["Python", "PyTorch", "SQL"],
            gap_skills=["Docker", "FastAPI", "AWS"]
        )
        firebase_service.save_interview_session(session)
    return session

@router.post("/{id}/answer")
async def submit_interview_answer(id: str, payload: Dict[str, Any] = Body(...)):
    """Evaluates candidate typed answer against rubric and returns scores and actionable suggestions."""
    session = firebase_service.get_interview_session(id)
    if not session:
        session = await interview_engine.generate_interview_session(
            analysis_id=id,
            role_title="Machine Learning Engineer",
            matched_skills=["Python", "PyTorch"],
            gap_skills=["Docker", "FastAPI"]
        )
        firebase_service.save_interview_session(session)

    question_id = payload.get("questionId")
    user_answer = payload.get("userAnswer", "")

    target_q = None
    for q in session.questions:
        if q.id == question_id:
            target_q = q
            break

    if not target_q and session.questions:
        target_q = session.questions[0]

    evaluation = await interview_engine.evaluate_answer(target_q, user_answer)

    target_q.userAnswer = user_answer
    target_q.scoreRelevance = evaluation.get("scoreRelevance", 4)
    target_q.scoreDepth = evaluation.get("scoreDepth", 3)
    target_q.scoreClarity = evaluation.get("scoreClarity", 4)
    target_q.totalScore = evaluation.get("totalScore", 3.7)
    target_q.aiFeedback = evaluation.get("aiFeedback", "Solid answer. Adding quantifiable metrics would elevate depth.")
    target_q.betterAnswerSnippet = evaluation.get("betterAnswerSnippet", "")

    session.completedQuestionsCount = sum(1 for q in session.questions if q.userAnswer)
    if session.completedQuestionsCount >= len(session.questions):
        session.overallReadinessSignal = "Interview Practice Complete"

    firebase_service.save_interview_session(session)

    return {
        "success": True,
        "question": target_q,
        "sessionCompletedCount": session.completedQuestionsCount,
        "totalQuestions": len(session.questions)
    }
