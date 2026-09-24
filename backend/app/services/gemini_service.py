import json
import logging
import hashlib
import httpx
from typing import Dict, Any, Optional
from app.config import settings

logger = logging.getLogger("careergap.gemini")

# In-memory prompt-response cache to prevent duplicate AI invocations
_AI_PROMPT_CACHE: Dict[str, Dict[str, Any]] = {}

class GeminiService:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.model = settings.GEMINI_MODEL
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models"
        self.timeout_seconds = 18.0  # Explicit 18s fast timeout

    def _get_cache_key(self, prompt: str, system_instruction: Optional[str]) -> str:
        content = f"{system_instruction or ''}:::{prompt}"
        return hashlib.sha256(content.encode("utf-8")).hexdigest()

    async def generate_json(self, prompt: str, system_instruction: Optional[str] = None, max_retries: int = 1) -> Dict[str, Any]:
        """
        Calls Gemini API with JSON structured output mode, fast 18s timeout, 1 retry, and prompt caching.
        """
        if not self.api_key:
            logger.info("No GEMINI_API_KEY configured. Falling back to deterministic heuristics.")
            return {}

        # Check Cache
        cache_key = self._get_cache_key(prompt, system_instruction)
        if cache_key in _AI_PROMPT_CACHE:
            logger.info("Retrieved AI response from in-memory cache.")
            return _AI_PROMPT_CACHE[cache_key]

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

        for attempt in range(max_retries + 1):
            try:
                async with httpx.AsyncClient(timeout=self.timeout_seconds) as client:
                    response = await client.post(url, json=payload)
                    
                    if response.status_code != 200:
                        logger.warning(f"Gemini API error (attempt {attempt+1}/{max_retries+1}): {response.status_code}")
                        if attempt == max_retries:
                            return {}
                        continue

                    data = response.json()
                    candidates = data.get("candidates", [])
                    if not candidates:
                        logger.warning("No candidates in Gemini response")
                        continue

                    text_content = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                    
                    # Clean markdown formatting wrappers
                    clean_text = text_content.strip()
                    if clean_text.startswith("```json"):
                        clean_text = clean_text[7:]
                    if clean_text.startswith("```"):
                        clean_text = clean_text[3:]
                    if clean_text.endswith("```"):
                        clean_text = clean_text[:-3]
                    clean_text = clean_text.strip()

                    parsed = json.loads(clean_text)
                    # Cache successful parsed output
                    _AI_PROMPT_CACHE[cache_key] = parsed
                    return parsed
            except httpx.TimeoutException:
                logger.warning(f"Gemini API call timed out after {self.timeout_seconds}s (attempt {attempt+1})")
                if attempt == max_retries:
                    return {}
            except Exception as e:
                logger.warning(f"Gemini call exception on attempt {attempt+1}: {str(e)}")
                if attempt == max_retries:
                    return {}

        return {}

gemini_service = GeminiService()
