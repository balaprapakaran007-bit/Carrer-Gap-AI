import pytest
from app.services.embedding_service import embedding_service
from app.services.evidence_engine import evidence_engine
from app.services.matching_engine import matching_engine
from app.services.benchmark_engine import benchmark_engine
from app.services.resource_matcher import resource_matcher
from app.models.schemas import SkillStatus, ImportanceLevel, EvidenceLevel, SkillAnalysisItem

def test_skill_normalization():
    assert embedding_service.normalize_skill("js") == "JavaScript"
    assert embedding_service.normalize_skill("postgres") == "PostgreSQL"
    assert embedding_service.normalize_skill("ml") == "Machine Learning"
    assert embedding_service.normalize_skill("k8s") == "Kubernetes"

def test_evidence_engine():
    strong_text = "Developed and engineered scalable backend services in Python, reducing query latency by 45%."
    level, snippet, _ = evidence_engine.evaluate_evidence("Python", strong_text)
    assert level == EvidenceLevel.STRONG
    assert snippet is not None

    weak_text = "Skills: Python, Java, Docker, AWS"
    level_weak, _, _ = evidence_engine.evaluate_evidence("Docker", weak_text)
    assert level_weak == EvidenceLevel.WEAK

    missing_text = "Experienced in frontend web design."
    level_missing, _, _ = evidence_engine.evaluate_evidence("Docker", missing_text)
    assert level_missing == EvidenceLevel.NOT_DEMONSTRATED

def test_transparent_score_calculation():
    items = [
        SkillAnalysisItem(
            skill="Python",
            status=SkillStatus.MATCHED,
            importance=ImportanceLevel.CRITICAL,
            evidenceLevel=EvidenceLevel.STRONG,
            whyItMatters="Core",
            category="Backend"
        ),
        SkillAnalysisItem(
            skill="SQL",
            status=SkillStatus.MATCHED,
            importance=ImportanceLevel.CRITICAL,
            evidenceLevel=EvidenceLevel.STRONG,
            whyItMatters="Core",
            category="Data"
        ),
        SkillAnalysisItem(
            skill="Docker",
            status=SkillStatus.MISSING,
            importance=ImportanceLevel.HIGH,
            evidenceLevel=EvidenceLevel.NOT_DEMONSTRATED,
            whyItMatters="Deployment",
            category="DevOps"
        ),
    ]
    score, breakdown = matching_engine.calculate_transparent_score(items)
    assert 0 <= score <= 100
    assert breakdown.criticalSkills == 40.0
    assert breakdown.highPriority == 0.0

def test_resource_matcher():
    resources = resource_matcher.get_resources_for_skill("Docker")
    assert len(resources) >= 2
    assert any("docker" in r.url.lower() for r in resources)

def test_benchmark_engine():
    res = benchmark_engine.get_benchmark_comparison(
        "Machine Learning Engineer",
        78.0,
        ["Python", "PyTorch", "SQL"],
        ["Docker", "FastAPI"]
    )
    assert res.roleKey == "ai_ml_engineer"
    assert res.avgReadiness > 0
    assert "Python" in res.aheadSkills
