import re
import logging
from typing import List, Dict, Any
from app.models.schemas import RequirementItem, ImportanceLevel
from app.services.embedding_service import embedding_service, SKILL_TAXONOMY_ALIASES
from app.services.gemini_service import gemini_service

logger = logging.getLogger("careergap.job_parser")

class JobParser:
    def extract_heuristics(self, job_text: str) -> List[RequirementItem]:
        """Heuristic rule-based extractor for job requirements."""
        requirements = []
        lower_text = job_text.lower()
        
        # Look for skills in job description
        critical_keywords = ["must have", "required", "essential", "minimum qualifications", "core requirements"]
        high_keywords = ["preferred", "strong experience", "proficient", "deep understanding"]
        optional_keywords = ["plus", "bonus", "nice to have", "good to have", "familiarity"]

        detected_skills = set()
        for alias, canonical in SKILL_TAXONOMY_ALIASES.items():
            pattern = r'(?<![a-zA-Z0-9_\-\+])' + re.escape(alias) + r'(?![a-zA-Z0-9_\-\+])'
            if re.search(pattern, lower_text):
                detected_skills.add(canonical)

        for skill in detected_skills:
            # Determine importance by nearby words
            skill_lower = skill.lower()
            idx = lower_text.find(skill_lower)
            snippet = lower_text[max(0, idx - 100): min(len(lower_text), idx + 100)] if idx != -1 else ""

            importance = ImportanceLevel.HIGH
            if any(k in snippet for k in critical_keywords) or skill in ["Python", "SQL", "Machine Learning", "System Design"]:
                importance = ImportanceLevel.CRITICAL
            elif any(k in snippet for k in optional_keywords):
                importance = ImportanceLevel.OPTIONAL
            elif any(k in snippet for k in high_keywords):
                importance = ImportanceLevel.HIGH
            else:
                importance = ImportanceLevel.MEDIUM

            requirements.append(RequirementItem(
                requirement=f"Proficiency and practical experience in {skill}",
                importance=importance,
                category="Core Engineering",
                matched=False
            ))
            
        return requirements

    async def parse_with_ai(self, job_title: str, job_text: str) -> List[RequirementItem]:
        """Uses Gemini to parse and classify requirements into Critical, High, Medium, Optional."""
        prompt = f"""
        Extract the key technical and architectural requirements from this job description for the role "{job_title}".
        Categorize each requirement's importance strictly into one of: "Critical", "High", "Medium", "Optional".
        
        Job Description:
        \"\"\"{job_text[:4000]}\"\"\"
        
        Return a JSON array of requirements:
        {{
          "requirements": [
            {{
              "requirement": "Clean skill or requirement statement e.g. 'Python & PyTorch for model development'",
              "importance": "Critical",
              "category": "Machine Learning / Backend / Cloud"
            }}
          ]
        }}
        """
        result = await gemini_service.generate_json(prompt, "You are an expert technical recruiter and job requirement extractor.")
        if result and "requirements" in result and isinstance(result["requirements"], list):
            items = []
            for r in result["requirements"]:
                try:
                    imp_str = str(r.get("importance", "Medium")).capitalize()
                    imp = ImportanceLevel.MEDIUM
                    if imp_str in ["Critical", "High", "Medium", "Optional"]:
                        imp = ImportanceLevel(imp_str)
                    items.append(RequirementItem(
                        requirement=r.get("requirement", ""),
                        importance=imp,
                        category=r.get("category", "General"),
                        matched=False
                    ))
                except Exception:
                    continue
            if items:
                return items

        return self.extract_heuristics(job_text)

job_parser = JobParser()
