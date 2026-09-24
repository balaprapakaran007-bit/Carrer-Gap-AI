import re
from typing import Dict, Any, Tuple, List, Optional
from app.models.schemas import EvidenceLevel, SkillStatus
from app.services.embedding_service import embedding_service

class EvidenceEngine:
    def evaluate_evidence(self, skill: str, resume_text: str) -> Tuple[EvidenceLevel, Optional[str], str]:
        """
        Analyzes evidence of a skill within the resume text.
        Returns (EvidenceLevel, matched_sentence, recommendation).
        """
        normalized_skill = embedding_service.normalize_skill(skill)
        lower_skill = skill.lower()
        lower_resume = resume_text.lower()

        # Find sentences or bullet points mentioning the skill or its aliases
        sentences = re.split(r'[\n\.\•\-\*]', resume_text)
        matching_sentences = []
        for s in sentences:
            s_clean = s.strip()
            if not s_clean:
                continue
            if re.search(r'(?<![a-zA-Z0-9_\-\+])' + re.escape(lower_skill) + r'(?![a-zA-Z0-9_\-\+])', s_clean.lower()):
                matching_sentences.append(s_clean)

        if not matching_sentences:
            return (
                EvidenceLevel.NOT_DEMONSTRATED,
                None,
                f"No practical or contextual evidence for {normalized_skill} was found in your resume."
            )

        best_sentence = matching_sentences[0]
        full_context = " ".join(matching_sentences).lower()

        # Strong evidence signals: metrics, action verbs, project outcomes, pipelines, deployment
        strong_action_words = [
            "developed", "built", "engineered", "implemented", "deployed", "scaled",
            "architected", "optimized", "reduced", "increased", "trained", "integrated",
            "automated", "designed", "created", "production", "pipeline", "api", "latency"
        ]
        has_metrics = bool(re.search(r'\d+\%|\d+x|\d+ms|\$\d+|\b\d+\b\s*(users|requests|rps|qps|accuracy)', full_context))
        action_word_count = sum(1 for w in strong_action_words if w in full_context)

        # Check if it's only in a skills list (e.g. "Skills: Python, Docker, SQL")
        is_just_skill_list = any("skill" in s.lower() or "technolog" in s.lower() or "tools" in s.lower() for s in matching_sentences) and len(matching_sentences) == 1 and len(best_sentence.split(",")) > 3

        if (action_word_count >= 2 or has_metrics) and not is_just_skill_list and len(best_sentence) > 35:
            return (
                EvidenceLevel.STRONG,
                best_sentence,
                f"Strong evidence with practical implementation for {normalized_skill}."
            )
        elif action_word_count >= 1 and not is_just_skill_list:
            return (
                EvidenceLevel.MODERATE,
                best_sentence,
                f"Demonstrated in project/work context, but adding measurable metrics or production scale would elevate {normalized_skill} to Strong."
            )
        else:
            return (
                EvidenceLevel.WEAK,
                best_sentence,
                f"Listed in skills, but lacks hands-on implementation evidence. Add a project or measurable contribution demonstrating {normalized_skill}."
            )

evidence_engine = EvidenceEngine()
