from fastapi import APIRouter
from app.models.schemas import BenchmarkRoleResponse
from app.services.benchmark_engine import benchmark_engine
from app.services.firebase_service import firebase_service

router = APIRouter(prefix="/benchmarks", tags=["Peer Benchmarks"])

@router.get("/{roleKey}", response_model=BenchmarkRoleResponse)
async def get_benchmarks(roleKey: str):
    """Retrieves anonymized peer benchmark comparison for a role."""
    # Retrieve demo analysis score for context
    demo_analysis = firebase_service.get_analysis("demo-analysis-ml-01")
    candidate_score = demo_analysis.readinessScore if demo_analysis else 78.0
    matched = demo_analysis.topStrengths if demo_analysis else ["Python", "SQL", "Machine Learning"]
    gaps = demo_analysis.primaryGaps if demo_analysis else ["Docker", "FastAPI", "AWS"]

    return benchmark_engine.get_benchmark_comparison(
        role_title=roleKey,
        candidate_score=candidate_score,
        matched_skills=matched,
        gap_skills=gaps
    )
