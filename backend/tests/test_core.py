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

def test_resume_parser():
    from app.services.resume_parser import resume_parser
    import io, zipfile
    
    # Test plain text parsing
    text = "John Doe\nPython, PyTorch, SQL developer\nExperienced with AWS and Docker"
    parsed = resume_parser.parse_file(text.encode("utf-8"), "resume.txt")
    assert "Python" in parsed
    
    skills = resume_parser.extract_detected_skills(parsed)
    assert "Python" in skills
    assert "SQL" in skills
    assert "Docker" in skills

    # Test docx parsing
    docx_buffer = io.BytesIO()
    with zipfile.ZipFile(docx_buffer, "w") as z:
        xml_content = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
            <w:body>
                <w:p><w:r><w:t>Vasanth T</w:t></w:r></w:p>
                <w:p><w:r><w:t>Software Engineer with Python, Machine Learning, and Kubernetes</w:t></w:r></w:p>
            </w:body>
        </w:document>"""
        z.writestr("word/document.xml", xml_content)
    
    docx_bytes = docx_buffer.getvalue()
    docx_parsed = resume_parser.parse_file(docx_bytes, "Vasanth_T_Resume.docx")
    assert "Vasanth T" in docx_parsed
    assert "Python" in docx_parsed
    
    docx_skills = resume_parser.extract_detected_skills(docx_parsed)
    assert "Python" in docx_skills
    assert "Machine Learning" in docx_skills
