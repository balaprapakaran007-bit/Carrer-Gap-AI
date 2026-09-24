import uuid
import asyncio
import logging
from typing import List, Dict, Any
from app.models.schemas import ProjectGapItem
from app.services.embedding_service import embedding_service
from app.services.gemini_service import gemini_service

logger = logging.getLogger("careergap.gap_engine")

class GapEngine:
    def get_template_projects(self, missing_skills: List[str]) -> List[ProjectGapItem]:
        """Provides high-quality, pre-architected fallback projects that close common skill gaps."""
        norm_gaps = [embedding_service.normalize_skill(s) for s in missing_skills]
        projects = []

        # Case 1: Docker + FastAPI / Backend API gaps
        if any(s in norm_gaps for s in ["Docker", "FastAPI", "RESTful APIs", "Microservices Architecture"]):
            projects.append(ProjectGapItem(
                id=str(uuid.uuid4())[:8],
                title="Containerized AI Document & Resume Parser Microservice",
                description="Engineered a scalable REST API using FastAPI and Docker to parse, index, and analyze documents asynchronously with worker queues.",
                closesSkills=[s for s in ["Docker", "FastAPI", "RESTful APIs", "Microservices Architecture", "Redis"] if s in norm_gaps or len(projects) == 0][:4],
                difficulty="Intermediate",
                estimatedDays=3,
                architectureSummary="FastAPI asynchronous endpoints -> Celery/Redis background worker -> Docker Compose multi-container deployment.",
                coreFeatures=[
                    "Multi-format document ingestion (PDF, DOCX, TXT) with async worker processing",
                    "Docker Compose configuration with isolated networking, volume persistence, and environment secrets",
                    "OpenAPI / Swagger interactive docs with JWT token authentication",
                    "Health checks and Prometheus metrics endpoints"
                ],
                technologies=["FastAPI", "Docker", "Docker Compose", "Python", "Redis", "Pydantic", "PyPDF"],
                implementationSteps=[
                    "Step 1: Set up FastAPI application structure with Pydantic request models",
                    "Step 2: Implement PDF text extraction and semantic parsing pipeline",
                    "Step 3: Write multi-stage Dockerfile optimizing image size and security",
                    "Step 4: Configure docker-compose.yml for web service and Redis cache",
                    "Step 5: Deploy container locally and write unit tests for endpoints"
                ],
                resumeBullet="Engineered a containerized FastAPI microservice with Docker and Redis, reducing document parsing latency by 45% across concurrent client requests."
            ))

        # Case 2: Machine Learning / PyTorch / RAG gaps
        if any(s in norm_gaps for s in ["Machine Learning", "PyTorch", "Retrieval Augmented Generation", "Large Language Models", "Deep Learning"]):
            projects.append(ProjectGapItem(
                id=str(uuid.uuid4())[:8],
                title="Production RAG Knowledge Search & Evaluation Pipeline",
                description="Built an enterprise semantic retrieval and question-answering pipeline using vector embeddings, hybrid reranking, and hallucination guardrails.",
                closesSkills=[s for s in ["Retrieval Augmented Generation", "Large Language Models", "PyTorch", "Machine Learning", "Vector Databases"] if s in norm_gaps or len(projects) == 0][:4],
                difficulty="Advanced",
                estimatedDays=4,
                architectureSummary="Document chunking -> Embedding generation -> Vector indexing -> Cross-encoder reranker -> LLM generation & Ragas eval.",
                coreFeatures=[
                    "Hybrid search combining dense semantic vectors with BM25 keyword search",
                    "Contextual compression and reranking for reduced token cost and improved recall",
                    "Automated hallucination metric scoring using RAGAS evaluation framework",
                    "Clean web UI dashboard for testing and query analysis"
                ],
                technologies=["Python", "PyTorch", "ChromaDB / Pinecone", "Gemini API", "FastAPI", "LangChain"],
                implementationSteps=[
                    "Step 1: Ingest and chunk domain technical documents with semantic boundaries",
                    "Step 2: Generate and index vector embeddings with cosine similarity distance",
                    "Step 3: Implement cross-encoder reranking stage for high-precision retrieval",
                    "Step 4: Connect LLM response generator with strict prompt grounding",
                    "Step 5: Benchmark retrieval accuracy and latency under load"
                ],
                resumeBullet="Architected an end-to-end RAG system with hybrid semantic search and reranking, achieving 92% retrieval precision and sub-200ms query latency."
            ))

        # Case 3: Cloud / AWS / GCP / Kubernetes gaps
        if any(s in norm_gaps for s in ["Amazon Web Services (AWS)", "Google Cloud Platform (GCP)", "Kubernetes", "CI/CD Pipelines"]):
            projects.append(ProjectGapItem(
                id=str(uuid.uuid4())[:8],
                title="Automated Cloud CI/CD & Kubernetes Deployment Pipeline",
                description="Designed and deployed a continuous integration and deployment workflow on cloud infrastructure with automated automated testing and rollback.",
                closesSkills=[s for s in ["Amazon Web Services (AWS)", "Kubernetes", "CI/CD Pipelines", "Linux", "Google Cloud Platform (GCP)"] if s in norm_gaps][:4],
                difficulty="Intermediate",
                estimatedDays=3,
                architectureSummary="GitHub Actions -> Docker Build & Push -> AWS ECR / GCP Artifact Registry -> Kubernetes Cluster Deployment.",
                coreFeatures=[
                    "Automated GitHub Actions CI pipeline executing linting, unit testing, and Docker build",
                    "Kubernetes manifests with Deployments, Services, Ingress, and ConfigMaps",
                    "Zero-downtime rolling update strategy with automated liveness and readiness probes",
                    "Cloud cost monitoring and secret manager integration"
                ],
                technologies=["GitHub Actions", "Kubernetes", "Docker", "AWS / GCP", "Terraform", "Linux"],
                implementationSteps=[
                    "Step 1: Write Dockerfile and Kubernetes deployment yaml manifests",
                    "Step 2: Set up GitHub Actions CI workflow triggered on git push",
                    "Step 3: Configure cloud container registry and IAM access credentials",
                    "Step 4: Test rolling deployment and auto-healing on pod termination",
                    "Step 5: Document deployment architecture in GitHub README"
                ],
                resumeBullet="Implemented automated GitHub Actions CI/CD pipeline deploying containerized services to Kubernetes, cutting deployment cycle times from hours to 4 minutes."
            ))

        # Default fallback project if no specific cluster matched
        if not projects:
            skill_label = ", ".join(norm_gaps[:2]) if norm_gaps else "Modern Tech Stack"
            projects.append(ProjectGapItem(
                id=str(uuid.uuid4())[:8],
                title=f"Full-Stack Production System Demonstrating {skill_label}",
                description=f"Developed an end-to-end application highlighting proficiency in {skill_label} with clean architecture and automated test coverage.",
                closesSkills=norm_gaps[:3],
                difficulty="Intermediate",
                estimatedDays=3,
                architectureSummary="Modular frontend + FastAPI backend service + Relational database storage + Unit tests.",
                coreFeatures=[
                    "Interactive client interface with state management",
                    "RESTful endpoints with request validation and database queries",
                    "Automated test suite with >80% code coverage"
                ],
                technologies=norm_gaps[:3] + ["Python", "FastAPI", "SQL", "Git"],
                implementationSteps=[
                    "Step 1: Define schema models and API endpoints",
                    "Step 2: Implement core business logic",
                    "Step 3: Write comprehensive unit and integration tests",
                    "Step 4: Package and document project with clear README setup"
                ],
                resumeBullet=f"Engineered full-stack application leveraging {skill_label}, delivering reliable API performance and comprehensive automated test coverage."
            ))

        return projects

    async def generate_projects_with_ai(self, missing_skills: List[str], target_role: str) -> List[ProjectGapItem]:
        """Uses Gemini to generate tailored project proposals with strict 10s timeout ceiling and instant fallback."""
        if not missing_skills:
            return self.get_template_projects(["System Design", "Cloud Deployment"])

        prompt = f"""
        Given the target role "{target_role}" and missing candidate skills: {missing_skills[:5]},
        propose 2 concrete, realistic portfolio projects demonstrating these skills.
        
        Return JSON:
        {{
          "projects": [
            {{
              "title": "Project Title",
              "description": "2-3 sentence project description",
              "closesSkills": ["Skill1", "Skill2"],
              "difficulty": "Intermediate",
              "estimatedDays": 3,
              "architectureSummary": "High level architecture",
              "coreFeatures": ["Feature 1", "Feature 2", "Feature 3"],
              "technologies": ["Tech 1", "Tech 2"],
              "implementationSteps": ["Step 1", "Step 2", "Step 3", "Step 4"],
              "resumeBullet": "High impact action-oriented resume bullet"
            }}
          ]
        }}
        """
        try:
            result = await asyncio.wait_for(
                gemini_service.generate_json(prompt, "You are a senior tech lead designing portfolio projects."),
                timeout=10.0
            )
            if result and "projects" in result and isinstance(result["projects"], list) and len(result["projects"]) > 0:
                parsed = []
                for p in result["projects"]:
                    try:
                        p["id"] = str(uuid.uuid4())[:8]
                        parsed.append(ProjectGapItem(**p))
                    except Exception:
                        continue
                if parsed:
                    return parsed
        except Exception as e:
            logger.info(f"AI project generation bypassed or timed out ({str(e)}), using template architectures.")

        return self.get_template_projects(missing_skills)

gap_engine = GapEngine()
