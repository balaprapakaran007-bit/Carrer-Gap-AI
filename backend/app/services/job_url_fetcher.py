import urllib.parse
import logging
import httpx
from bs4 import BeautifulSoup
from app.config import settings

logger = logging.getLogger("careergap.job_url_fetcher")

class JobURLFetcher:
    def __init__(self):
        self.allowlist = [domain.strip().lower() for domain in settings.JOB_URL_FETCH_ALLOWLIST.split(",") if domain.strip()]

    def is_allowed_domain(self, url: str) -> bool:
        """Validates host domain to prevent SSRF and internal network scanning."""
        try:
            parsed = urllib.parse.urlparse(url)
            host = parsed.netloc.lower()
            if not host:
                return False
            
            # Prevent private/localhost IPs
            if host in ["localhost", "127.0.0.1", "0.0.0.0", "::1"] or host.startswith("192.168.") or host.startswith("10."):
                return False

            # Check if domain matches allowlist
            for allowed in self.allowlist:
                if host == allowed or host.endswith("." + allowed):
                    return True
            # Allow common public https URLs if valid scheme
            return parsed.scheme in ["http", "https"]
        except Exception:
            return False

    async def fetch_job_content(self, url: str) -> dict:
        """Fetches and cleans job description HTML from a job posting URL."""
        if not self.is_allowed_domain(url):
            raise ValueError("URL domain is not allowed or invalid for security safety.")

        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
        }

        try:
            async with httpx.AsyncClient(follow_redirects=True, timeout=15.0) as client:
                resp = await client.get(url, headers=headers)
                if resp.status_code != 200:
                    raise ValueError(f"Failed to fetch job posting (HTTP {resp.status_code}). Please copy and paste the job description text.")

                soup = BeautifulSoup(resp.text, "html.parser")

                # Remove scripts, styles, navigations, footers
                for tag in soup(["script", "style", "nav", "header", "footer", "aside", "noscript"]):
                    tag.decompose()

                # Extract title
                title_tag = soup.find("h1") or soup.find("title")
                title = title_tag.get_text().strip() if title_tag else "Imported Job Posting"

                # Extract main content
                main_tag = soup.find("main") or soup.find("article") or soup.find("div", class_=lambda c: c and ("job" in c.lower() or "description" in c.lower()))
                if main_tag:
                    text = main_tag.get_text(separator="\n", strip=True)
                else:
                    text = soup.get_text(separator="\n", strip=True)

                # Clean redundant whitespace
                lines = [line.strip() for line in text.splitlines() if line.strip()]
                cleaned_text = "\n".join(lines)

                if len(cleaned_text) < 100:
                    raise ValueError("Could not extract sufficient text from this job URL. Please paste the job description text manually.")

                return {
                    "url": url,
                    "title": title[:100],
                    "company": "Imported Company",
                    "extractedText": cleaned_text
                }

        except httpx.RequestError as e:
            logger.error(f"Network error fetching job URL {url}: {str(e)}")
            raise ValueError(f"Network connection error while fetching job URL. Please paste the text manually.")
        except Exception as e:
            logger.error(f"Error parsing job URL {url}: {str(e)}")
            raise ValueError(str(e))

job_url_fetcher = JobURLFetcher()
