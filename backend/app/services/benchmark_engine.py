import re
from typing import Dict, Any, List
from app.models.schemas import BenchmarkRoleResponse

# Pre-computed Anonymized Peer Benchmarks across tech roles
BENCHMARK_ROLE_DATA: Dict[str, Dict[str, Any]] = {
    "ai_ml_engineer": {
        "roleTitle": "AI / Machine Learning Engineer",
        "sampleSize": 1420,
        "avgReadiness": 65.4,
        "skillAverages": {
            "Python": 88.0,
            "SQL": 72.5,
            "Machine Learning": 74.0,
            "PyTorch": 62.0,
            "Docker": 48.0,
            "FastAPI": 51.0,
            "Amazon Web Services (AWS)": 44.0,
            "Retrieval Augmented Generation": 42.0,
            "System Design": 54.0
        }
    },
    "fullstack_developer": {
        "roleTitle": "Full Stack Developer",
        "sampleSize": 2890,
        "avgReadiness": 68.2,
        "skillAverages": {
            "JavaScript": 85.0,
            "TypeScript": 72.0,
            "React": 80.0,
            "Node.js": 71.0,
            "PostgreSQL": 66.0,
            "Docker": 52.0,
            "CI/CD Pipelines": 49.0,
            "RESTful APIs": 84.0
        }
    },
    "backend_engineer": {
        "roleTitle": "Backend Software Engineer",
        "sampleSize": 1980,
        "avgReadiness": 66.8,
        "skillAverages": {
            "Python": 78.0,
            "Go": 55.0,
            "SQL": 81.0,
            "PostgreSQL": 74.0,
            "Docker": 64.0,
            "Kubernetes": 46.0,
            "Microservices Architecture": 58.0,
            "Redis": 61.0,
            "System Design": 63.0
        }
    },
    "data_scientist": {
        "roleTitle": "Data Scientist",
        "sampleSize": 1150,
        "avgReadiness": 63.5,
        "skillAverages": {
            "Python": 86.0,
            "SQL": 79.0,
            "Machine Learning": 70.0,
            "Pandas": 89.0,
            "Scikit-Learn": 75.0,
            "Docker": 38.0,
            "Tableau": 52.0
        }
    }
}

class BenchmarkEngine:
    def get_role_key(self, role_title: str) -> str:
        """Normalizes role title to a clean key."""
        cleaned = re.sub(r'[^a-zA-Z0-9\s]', '', role_title.lower()).strip()
        if "ml" in cleaned or "machine learning" in cleaned or "ai" in cleaned:
            return "ai_ml_engineer"
        elif "full" in cleaned or "frontend" in cleaned or "web" in cleaned:
            return "fullstack_developer"
        elif "back" in cleaned or "api" in cleaned:
            return "backend_engineer"
        elif "data" in cleaned or "scientist" in cleaned or "analytics" in cleaned:
            return "data_scientist"
        return "ai_ml_engineer"

    def get_benchmark_comparison(self, role_title: str, candidate_score: float, matched_skills: List[str], gap_skills: List[str]) -> BenchmarkRoleResponse:
        """Compares candidate to anonymized peer averages."""
        role_key = self.get_role_key(role_title)
        data = BENCHMARK_ROLE_DATA.get(role_key, BENCHMARK_ROLE_DATA["ai_ml_engineer"])

        skill_avgs = data["skillAverages"]
        ahead_skills = []
        behind_skills = []

        for skill in matched_skills:
            if skill in skill_avgs:
                ahead_skills.append(skill)
            elif len(ahead_skills) < 3:
                ahead_skills.append(skill)

        for gap in gap_skills:
            if gap in skill_avgs:
                behind_skills.append(gap)
            elif len(behind_skills) < 3:
                behind_skills.append(gap)

        if not ahead_skills and matched_skills:
            ahead_skills = matched_skills[:3]
        if not behind_skills and gap_skills:
            behind_skills = gap_skills[:3]

        return BenchmarkRoleResponse(
            roleKey=role_key,
            roleTitle=data["roleTitle"],
            sampleSize=data["sampleSize"],
            avgReadiness=data["avgReadiness"],
            candidateScore=candidate_score,
            isEnoughData=data["sampleSize"] >= 5,
            aheadSkills=ahead_skills[:4],
            behindSkills=behind_skills[:4],
            skillAverages=skill_avgs
        )

benchmark_engine = BenchmarkEngine()
