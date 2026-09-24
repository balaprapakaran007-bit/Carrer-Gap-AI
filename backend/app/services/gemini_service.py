import json
import logging
import httpx
from typing import Dict, Any, Optional
from app.config import settings

logger = logging.getLogger("careergap.gemini")

class GeminiService:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.model = settings.GEMINI_MODEL
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models"

    async def generate_json(self, prompt: str, system_instruction: Optional[str] = None, max_retries: int = 2) -> Dict[str, Any]:
        """
        Calls Gemini API with JSON structured output mode and handles retries and error checking.
        """
        if not self.api_key:
            logger.warning("No GEMINI_API_KEY configured. Returning empty or mock structure.")
            return {}

        url = f"{self.base_url}/{self.model}:generateContent?key={self.api_key}"
        
        contents = []
        if system_instruction:
            contents.append({
                "role": "user",
                "parts": [{"text": f"System Context / Instructions:\n{system_instruction}\n\nTask:\n{prompt}"}]
            })
        else:
            contents.append({
                "role": "user",
                "parts": [{"text": prompt}]
            })

        payload = {
            "contents": contents,
            "generationConfig": {
                "temperature": 0.2,
                "responseMimeType": "application/json"
            }
        }

        for attempt in range(max_retries):
            try:
                async with httpx.AsyncClient(timeout=45.0) as client:
                    response = await client.post(url, json=payload)
                    
                    if response.status_code != 200:
                        logger.error(f"Gemini API error (attempt {attempt+1}): {response.status_code} - {response.text}")
                        if attempt == max_retries - 1:
                            return {}
                        continue

                    data = response.json()
                    candidates = data.get("candidates", [])
                    if not candidates:
                        logger.error("No candidates in Gemini response")
                        continue

                    text_content = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                    
                    # Clean markdown wrappers if any
                    clean_text = text_content.strip()
                    if clean_text.startswith("```json"):
                        clean_text = clean_text[7:]
                    if clean_text.startswith("```"):
                        clean_text = clean_text[3:]
                    if clean_text.endswith("```"):
                        clean_text = clean_text[:-3]
                    clean_text = clean_text.strip()

                    parsed = json.loads(clean_text)
                    return parsed
            except Exception as e:
                logger.error(f"Gemini call exception on attempt {attempt+1}: {str(e)}")
                if attempt == max_retries - 1:
                    return {}

        return {}

gemini_service = GeminiService()
