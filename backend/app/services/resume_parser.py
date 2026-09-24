import io
import re
import logging
from typing import List, Dict, Any, Tuple
from pypdf import PdfReader
from app.services.embedding_service import embedding_service, SKILL_TAXONOMY_ALIASES
from app.services.gemini_service import gemini_service

logger = logging.getLogger("careergap.resume_parser")

class ResumeParser:
    def parse_pdf(self, file_bytes: bytes) -> str:
        """Extracts text content cleanly from uploaded PDF bytes."""
        try:
            reader = PdfReader(io.BytesIO(file_bytes))
            full_text = []
            for i, page in enumerate(reader.pages):
                page_text = page.extract_text()
                if page_text:
                    full_text.append(page_text)
            
            extracted = "\n\n".join(full_text).strip()
            if not extracted or len(extracted) < 20:
                raise ValueError("Extracted text is empty or too short. Please provide a text-based PDF.")
            return extracted
        except Exception as e:
            logger.error(f"Error parsing PDF: {str(e)}")
            raise ValueError(f"Could not parse PDF: {str(e)}")

    def extract_detected_skills(self, text: str) -> List[str]:
        """Detects mentioned technical skills using taxonomy patterns and regex."""
        detected = set()
        lower_text = " " + text.lower() + " "
        
        # Check against canonical taxonomy aliases and common tech keywords
        for alias, canonical in SKILL_TAXONOMY_ALIASES.items():
            pattern = r'(?<![a-zA-Z0-9_\-\+])' + re.escape(alias) + r'(?![a-zA-Z0-9_\-\+])'
            if re.search(pattern, lower_text):
                detected.add(canonical)
                
        # Common additional keywords
        extra_keywords = [
            "Linux", "Git", "REST APIs", "GraphQL", "Agile", "Scrum", "Kubernetes",
            "Pandas", "NumPy", "TensorFlow", "PyTorch", "Next.js", "Tailwind CSS",
            "Java", "C++", "C#", "Rust", "Swift", "Flutter", "GCP", "AWS", "Azure"
        ]
        for kw in extra_keywords:
            pattern = r'(?<![a-zA-Z0-9_\-\+])' + re.escape(kw.lower()) + r'(?![a-zA-Z0-9_\-\+])'
            if re.search(pattern, lower_text):
                detected.add(embedding_service.normalize_skill(kw))
                
        return sorted(list(detected))

    async def parse_with_ai(self, resume_text: str) -> Dict[str, Any]:
        """Optionally uses Gemini to parse sections, experience summary, and project details."""
        prompt = f"""
        Analyze this resume text and extract the structured information in JSON format:
        
        Resume text:
        \"\"\"{resume_text[:4000]}\"\"\"
        
        Return a JSON object with:
        {{
          "candidate_name": "Full Name or Anonymous",
          "summary": "Short 2 sentence profile summary",
          "experience_years": 3,
          "extracted_skills": ["Skill1", "Skill2"],
          "projects": [
            {{
              "title": "Project name",
              "technologies": ["Tech1", "Tech2"],
              "description": "Brief description of implementation and outcomes"
            }}
          ],
          "work_experience": [
            {{
              "role": "Job Role",
              "company": "Company",
              "key_contributions": ["Contribution 1", "Contribution 2"]
            }}
          ]
        }}
        """
        result = await gemini_service.generate_json(prompt, "You are an expert resume parsing engine.")
        if not result or not result.get("extracted_skills"):
            # Fallback to local heuristic extraction
            skills = self.extract_detected_skills(resume_text)
            return {
                "candidate_name": "Candidate",
                "summary": "Professional Candidate Profile",
                "experience_years": 2,
                "extracted_skills": skills,
                "projects": [],
                "work_experience": []
            }
        return result

resume_parser = ResumeParser()
