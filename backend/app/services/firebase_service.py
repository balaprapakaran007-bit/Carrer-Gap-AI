import logging
import uuid
from datetime import datetime
from typing import Dict, Any, List, Optional
from app.config import settings
from app.models.schemas import (
    ResumeModel, JobModel, FullAnalysisResult, RoadmapStepItem,
    InterviewSessionModel, SkillProgressItem, StreakInfo, SharedProfilePublicView,
    SkillStatus, EvidenceLevel, ImportanceLevel, ScoreBreakdown, SkillAnalysisItem,
    RequirementItem, ProjectGapItem, ResumeSuggestionItem, LearningResourceItem,
    LearningResourceType
)

logger = logging.getLogger("careergap.firebase_service")

class FirebaseService:
    def __init__(self):
        # In-memory storage for high-speed access and offline/demo reliability
        self.users: Dict[str, Dict[str, Any]] = {}
        self.resumes: Dict[str, ResumeModel] = {}
        self.jobs: Dict[str, JobModel] = {}
        self.analyses: Dict[str, FullAnalysisResult] = {}
        self.interview_sessions: Dict[str, InterviewSessionModel] = {}
        self.skill_progress: Dict[str, List[SkillProgressItem]] = {}
        self.shared_profiles: Dict[str, SharedProfilePublicView] = {}
        self.streaks: Dict[str, StreakInfo] = {}

        self._seed_demo_data()

    def _seed_demo_data(self):
        """Initializes realistic, presentation-ready demo data for AI/ML Engineer and Target Job."""
        demo_user_id = "demo_user"
        demo_analysis_id = "demo-analysis-ml-01"
        demo_share_token = "demo-share-careergap-2026"

        # Demo Resume
        demo_resume_id = "demo-resume-01"
        demo_resume_text = """
        ALEX CHEN
        San Francisco, CA | alex.chen@example.com | github.com/alexchen-ai

        PROFESSIONAL SUMMARY
        Machine Learning Engineer with 2+ years of experience building predictive models, fine-tuning open-source LLMs, and deploying analytical data pipelines. Strong foundation in Python, PyTorch, SQL, and Machine Learning algorithms.

        TECHNICAL SKILLS
        - Languages & Frameworks: Python, PyTorch, Scikit-Learn, Pandas, NumPy, SQL, PostgreSQL, Git
        - Areas: Machine Learning, Deep Learning, Natural Language Processing, Feature Engineering
        - Basic Familiarity: Docker, AWS, FastAPI, REST APIs

        EXPERIENCE
        Associate Machine Learning Engineer | DataPulse Labs
        June 2024 – Present
        - Developed and trained a transformer-based text classification model using PyTorch and HuggingFace, improving document tagging precision by 18%.
        - Engineered ETL data pipelines in Python and PostgreSQL to process 500,000+ records daily with automated data quality validations.
        - Collaborated with senior engineers on model evaluation and A/B test experiments.

        Data Science Intern | Apex Analytics
        Jan 2024 – May 2024
        - Built customer churn prediction models using Scikit-Learn and XGBoost, achieving 0.84 ROC-AUC.
        - Analyzed large relational databases with complex SQL window functions and aggregations.

        PROJECTS
        Semantic Search & Question Answering Engine
        - Implemented semantic document search using dense vector embeddings and cosine similarity.
        - Built interactive user query interface with Streamlit.

        EDUCATION
        B.S. in Computer Science | University of California, Berkeley | 2020 – 2024
        """
        
        self.resumes[demo_resume_id] = ResumeModel(
            id=demo_resume_id,
            userId=demo_user_id,
            fileName="Alex_Chen_ML_Resume.pdf",
            storagePath="/resumes/Alex_Chen_ML_Resume.pdf",
            parsedText=demo_resume_text,
            skills=["Python", "PyTorch", "SQL", "PostgreSQL", "Machine Learning", "Deep Learning", "Natural Language Processing", "Pandas", "Scikit-Learn", "Git"],
            version=1,
            createdAt=datetime.utcnow().isoformat()
        )

        # Demo Job
        demo_job_id = "demo-job-01"
        demo_job_desc = """
        Role: Machine Learning Engineer
        Company: AI Nexus Corp
        Location: Remote / San Francisco

        About the Role:
        We are looking for a talented Machine Learning Engineer to design, build, and deploy production AI microservices. You will work across model development, containerized API deployments, and high-performance retrieval architectures.

        Requirements:
        - Critical: 2+ years of production experience in Python and Machine Learning model development
        - Critical: Deep proficiency in SQL and relational database modeling (PostgreSQL)
        - Critical: Hands-on experience with PyTorch or TensorFlow for deep learning
        - High: Experience designing and building RESTful APIs using FastAPI
        - High: Proficiency with Docker for containerizing microservices and local development
        - High: Familiarity with Retrieval Augmented Generation (RAG) and LLM application frameworks
        - Medium: Experience with Cloud infrastructure (AWS / GCP) and CI/CD pipelines
        - Medium: Understanding of System Design for scalable distributed services
        """

        self.jobs[demo_job_id] = JobModel(
            id=demo_job_id,
            userId=demo_user_id,
            title="Machine Learning Engineer",
            company="AI Nexus Corp",
            description=demo_job_desc,
            requirements=[
                RequirementItem(requirement="Production Python & ML Model Development", importance=ImportanceLevel.CRITICAL, category="Machine Learning", matched=True, evidence="Developed and trained transformer models using Python and PyTorch"),
                RequirementItem(requirement="Relational Database Modeling & SQL Proficiency", importance=ImportanceLevel.CRITICAL, category="Data Engineering", matched=True, evidence="Engineered ETL pipelines in PostgreSQL processing 500k+ records daily"),
                RequirementItem(requirement="Deep Learning with PyTorch", importance=ImportanceLevel.CRITICAL, category="Machine Learning", matched=True, evidence="Trained transformer-based text classification model using PyTorch"),
                RequirementItem(requirement="RESTful API Development with FastAPI", importance=ImportanceLevel.HIGH, category="Backend", matched=False, evidence=None),
                RequirementItem(requirement="Containerization with Docker", importance=ImportanceLevel.HIGH, category="DevOps / Cloud", matched=False, evidence=None),
                RequirementItem(requirement="Retrieval Augmented Generation (RAG)", importance=ImportanceLevel.HIGH, category="GenAI", matched=True, evidence="Implemented semantic document search using vector embeddings"),
                RequirementItem(requirement="Cloud Infrastructure (AWS / GCP)", importance=ImportanceLevel.MEDIUM, category="Cloud", matched=False, evidence="Basic Familiarity: AWS"),
                RequirementItem(requirement="System Design & Distributed Scalability", importance=ImportanceLevel.MEDIUM, category="Architecture", matched=False, evidence=None)
            ],
            sourceUrl="https://ainexus.example.com/careers/ml-engineer",
            createdAt=datetime.utcnow().isoformat()
        )

        # Demo Analysis Result (78% match as required by spec)
        demo_analysis = FullAnalysisResult(
            id=demo_analysis_id,
            userId=demo_user_id,
            resumeId=demo_resume_id,
            jobId=demo_job_id,
            jobTitle="Machine Learning Engineer",
            jobCompany="AI Nexus Corp",
            readinessScore=78.0,
            scoreBreakdown=ScoreBreakdown(
                criticalSkills=40.0,
                criticalMax=40.0,
                highPriority=16.0,
                highMax=30.0,
                mediumPriority=14.0,
                mediumMax=20.0,
                evidenceStrength=8.0,
                evidenceMax=10.0,
                totalScore=78.0
            ),
            matchedCount=12,
            missingCount=4,
            weakEvidenceCount=3,
            criticalRequirementsCount=5,
            skillsMatrix=[
                SkillAnalysisItem(
                    skill="Python",
                    status=SkillStatus.MATCHED,
                    importance=ImportanceLevel.CRITICAL,
                    evidenceLevel=EvidenceLevel.STRONG,
                    confidence="High",
                    matchedResumeText="Developed and trained transformer-based text classification model using Python and PyTorch",
                    whyItMatters="Core foundation for model development and production data pipelines.",
                    recommendation="Strong evidence verified across 2 distinct work experiences and projects.",
                    category="Programming"
                ),
                SkillAnalysisItem(
                    skill="SQL",
                    status=SkillStatus.MATCHED,
                    importance=ImportanceLevel.CRITICAL,
                    evidenceLevel=EvidenceLevel.STRONG,
                    confidence="High",
                    matchedResumeText="Engineered ETL data pipelines in Python and PostgreSQL to process 500,000+ records daily",
                    whyItMatters="Essential for feature store querying, data extraction, and metric pipelines.",
                    recommendation="Strong evidence of relational database querying and window functions.",
                    category="Data Engineering"
                ),
                SkillAnalysisItem(
                    skill="Machine Learning",
                    status=SkillStatus.MATCHED,
                    importance=ImportanceLevel.CRITICAL,
                    evidenceLevel=EvidenceLevel.STRONG,
                    confidence="High",
                    matchedResumeText="Built customer churn prediction models using Scikit-Learn and XGBoost, achieving 0.84 ROC-AUC",
                    whyItMatters="Central responsibility of the target role.",
                    recommendation="Practical statistical modeling and ML pipeline demonstration verified.",
                    category="AI / ML"
                ),
                SkillAnalysisItem(
                    skill="PyTorch",
                    status=SkillStatus.MATCHED,
                    importance=ImportanceLevel.CRITICAL,
                    evidenceLevel=EvidenceLevel.STRONG,
                    confidence="High",
                    matchedResumeText="Developed and trained a transformer-based text classification model using PyTorch and HuggingFace",
                    whyItMatters="Primary framework required for deep learning model training and inference.",
                    recommendation="Strong evidence with clear accuracy improvement metric.",
                    category="AI / ML"
                ),
                SkillAnalysisItem(
                    skill="Retrieval Augmented Generation",
                    status=SkillStatus.MATCHED,
                    importance=ImportanceLevel.MEDIUM,
                    evidenceLevel=EvidenceLevel.MODERATE,
                    confidence="High",
                    matchedResumeText="Implemented semantic document search using dense vector embeddings and cosine similarity",
                    whyItMatters="Needed for enterprise context search and LLM grounding workflows.",
                    recommendation="Demonstrated in portfolio project, but deploying to production with reranking will elevate to Strong.",
                    category="GenAI"
                ),
                SkillAnalysisItem(
                    skill="Docker",
                    status=SkillStatus.MISSING,
                    importance=ImportanceLevel.HIGH,
                    evidenceLevel=EvidenceLevel.NOT_DEMONSTRATED,
                    confidence="High",
                    matchedResumeText=None,
                    whyItMatters="Required in the job description for containerized microservice deployment, but not demonstrated in your profile.",
                    recommendation="Build a containerized FastAPI AI service with Docker Compose to close this high-priority gap.",
                    category="DevOps"
                ),
                SkillAnalysisItem(
                    skill="FastAPI",
                    status=SkillStatus.MISSING,
                    importance=ImportanceLevel.HIGH,
                    evidenceLevel=EvidenceLevel.NOT_DEMONSTRATED,
                    confidence="High",
                    matchedResumeText=None,
                    whyItMatters="Job requires building high-performance asynchronous RESTful model serving endpoints.",
                    recommendation="Implement a multi-endpoint REST API with Pydantic validation and async request handling.",
                    category="Backend"
                ),
                SkillAnalysisItem(
                    skill="Amazon Web Services (AWS)",
                    status=SkillStatus.WEAK,
                    importance=ImportanceLevel.MEDIUM,
                    evidenceLevel=EvidenceLevel.WEAK,
                    confidence="Medium",
                    matchedResumeText="Basic Familiarity: AWS",
                    whyItMatters="Listed in skills bullet without corresponding project or deployment evidence.",
                    recommendation="Deploy your containerized service to AWS (ECS/EC2 or Lambda) to convert this from Weak to Strong.",
                    category="Cloud"
                ),
                SkillAnalysisItem(
                    skill="System Design",
                    status=SkillStatus.MISSING,
                    importance=ImportanceLevel.MEDIUM,
                    evidenceLevel=EvidenceLevel.NOT_DEMONSTRATED,
                    confidence="Medium",
                    matchedResumeText=None,
                    whyItMatters="Required for scaling inference workloads and handling high query volumes.",
                    recommendation="Review microservice architecture patterns and caching strategies.",
                    category="Architecture"
                )
            ],
            requirements=self.jobs[demo_job_id].requirements,
            projectGaps=[
                ProjectGapItem(
                    id="proj-gap-01",
                    title="Containerized AI Resume Analysis & Embedding API",
                    description="Build an asynchronous FastAPI microservice containerized with Docker to process document embeddings, compute semantic similarities, and serve ML inference with Redis caching.",
                    closesSkills=["Docker", "FastAPI", "RESTful APIs", "Redis"],
                    difficulty="Intermediate",
                    estimatedDays=3,
                    architectureSummary="FastAPI Async App -> Docker Multi-stage Container -> Redis Query Cache -> Pydantic Validation",
                    coreFeatures=[
                        "Async batch embedding generation endpoint with worker queues",
                        "Dockerized multi-stage container with isolated network configuration",
                        "Prometheus latency telemetry and Swagger UI documentation"
                    ],
                    technologies=["FastAPI", "Docker", "Python", "Redis", "Pydantic", "PyPDF"],
                    implementationSteps=[
                        "Step 1: Set up FastAPI application structure with Pydantic request models",
                        "Step 2: Implement PDF text extraction and semantic parsing pipeline",
                        "Step 3: Write multi-stage Dockerfile optimizing image size and security",
                        "Step 4: Configure docker-compose.yml for web service and Redis cache",
                        "Step 5: Deploy container locally and write unit tests for endpoints"
                    ],
                    resumeBullet="Engineered a containerized FastAPI microservice with Docker and Redis, reducing document parsing latency by 45% across concurrent client requests."
                ),
                ProjectGapItem(
                    id="proj-gap-02",
                    title="Cloud-Deployed RAG Knowledge Assistant on AWS",
                    description="Deploy an enterprise retrieval-augmented generation pipeline on AWS with automated CI/CD and vector database index synchronization.",
                    closesSkills=["Amazon Web Services (AWS)", "Retrieval Augmented Generation", "CI/CD Pipelines"],
                    difficulty="Intermediate",
                    estimatedDays=4,
                    architectureSummary="GitHub Actions CI/CD -> AWS ECS / Fargate Deployment -> Pinecone Vector Store -> CloudWatch Monitoring",
                    coreFeatures=[
                        "Automated GitHub Actions CI/CD deployment on git push",
                        "Hybrid search with contextual reranking",
                        "CloudWatch log aggregation and cost monitoring"
                    ],
                    technologies=["AWS ECS", "GitHub Actions", "Docker", "Python", "Pinecone"],
                    implementationSteps=[
                        "Step 1: Containerize application and push image to AWS ECR",
                        "Step 2: Create ECS Fargate task definition with environment secrets",
                        "Step 3: Set up GitHub Actions workflow for automated testing and deployment",
                        "Step 4: Configure load balancer and health check probes"
                    ],
                    resumeBullet="Deployed a resilient RAG search pipeline on AWS ECS via GitHub Actions CI/CD, handling 1,000+ daily semantic queries with 99.9% uptime."
                )
            ],
            roadmap=[
                RoadmapStepItem(
                    id="step-1",
                    stepNumber=1,
                    skill="Docker",
                    title="Master Docker Fundamentals & Container Basics",
                    reason="Docker is explicitly required for production microservices but not demonstrated in your profile.",
                    learningObjective="Learn container lifecycle, image building, multi-stage Dockerfiles, and container networking.",
                    recommendedResources=[
                        LearningResourceItem(
                            title="Official Docker 'Get Started' Documentation",
                            type=LearningResourceType.DOCUMENTATION,
                            url="https://docs.docker.com/get-started/",
                            platform="Docker Official Docs",
                            estimatedHours=3.0,
                            isFree=True
                        ),
                        LearningResourceItem(
                            title="Docker Tutorial for Beginners (FreeCodeCamp)",
                            type=LearningResourceType.YOUTUBE,
                            url="https://www.youtube.com/watch?v=fqMOX6JJhGo",
                            platform="YouTube - FreeCodeCamp",
                            estimatedHours=3.5,
                            isFree=True
                        )
                    ],
                    practicalTask="Write a multi-stage Dockerfile for a Python service and run it in an isolated container.",
                    estimatedHours=6.0,
                    isCompleted=False,
                    expectedImprovement="Docker → Basic Understanding"
                ),
                RoadmapStepItem(
                    id="step-2",
                    stepNumber=2,
                    skill="FastAPI",
                    title="Containerize a Production FastAPI Microservice",
                    reason="Job requires high-performance REST APIs for serving ML predictions.",
                    learningObjective="Build asynchronous endpoints with Pydantic request validation and dependency injection.",
                    recommendedResources=[
                        LearningResourceItem(
                            title="FastAPI Official Interactive Tutorial & User Guide",
                            type=LearningResourceType.DOCUMENTATION,
                            url="https://fastapi.tiangolo.com/tutorial/",
                            platform="Tiangolo FastAPI Docs",
                            estimatedHours=4.0,
                            isFree=True
                        )
                    ],
                    practicalTask="Build and test a containerized FastAPI service with OpenAPI documentation and health checks.",
                    estimatedHours=8.0,
                    isCompleted=False,
                    expectedImprovement="FastAPI → Demonstrated"
                ),
                RoadmapStepItem(
                    id="step-3",
                    stepNumber=3,
                    skill="Amazon Web Services (AWS)",
                    title="Deploy Application to Cloud & Set up CI/CD",
                    reason="Elevate AWS from weak mention to strong verified deployment evidence.",
                    learningObjective="Configure cloud container instances, manage environment secrets, and automate deployment.",
                    recommendedResources=[
                        LearningResourceItem(
                            title="AWS Cloud Practitioner & Serverless Essentials",
                            type=LearningResourceType.DOCUMENTATION,
                            url="https://aws.amazon.com/getting-started/",
                            platform="AWS Skill Builder",
                            estimatedHours=6.0,
                            isFree=True
                        )
                    ],
                    practicalTask="Deploy your containerized FastAPI application to AWS and configure GitHub Actions CI.",
                    estimatedHours=6.0,
                    isCompleted=False,
                    expectedImprovement="AWS: Weak Evidence → Strong Evidence"
                ),
                RoadmapStepItem(
                    id="step-4",
                    stepNumber=4,
                    skill="Resume & Portfolio",
                    title="Update Resume Bullets & Re-verify Match Score",
                    reason="Translate completed projects into high-impact, ATS-optimized quantified achievements.",
                    learningObjective="Showcase measurable outcomes using the STAR method.",
                    recommendedResources=[],
                    practicalTask="Update resume with newly built project bullets and re-run CareerGap AI analysis.",
                    estimatedHours=2.0,
                    isCompleted=False,
                    expectedImprovement="Overall Readiness: 78% → 92% (Job Ready)"
                )
            ],
            resumeSuggestions=[
                ResumeSuggestionItem(
                    originalText="Basic Familiarity: AWS",
                    improvedText="Architected and deployed containerized ML services to AWS ECS using Docker and GitHub Actions, ensuring zero-downtime rolling updates.",
                    reason="Replaces weak buzzword listing with concrete architectural deployment evidence.",
                    targetedSkill="AWS"
                ),
                ResumeSuggestionItem(
                    originalText="Implemented semantic document search using dense vector embeddings.",
                    improvedText="Engineered a low-latency semantic search pipeline using vector embeddings and cosine similarity, processing 10,000+ document queries with sub-150ms response times.",
                    reason="Quantifies scale and performance metrics for the RAG project.",
                    targetedSkill="Retrieval Augmented Generation"
                )
            ],
            topStrengths=["Python", "SQL", "Machine Learning", "PyTorch", "Retrieval Augmented Generation"],
            primaryGaps=["Docker", "FastAPI", "AWS", "System Design"],
            summaryParagraph="Your profile demonstrates strong alignment with core Machine Learning, PyTorch, and SQL requirements for the Machine Learning Engineer role at AI Nexus Corp. Closing Docker and FastAPI through the recommended roadmap will raise your job readiness from 78% to 92%+.",
            isShareable=True,
            shareToken=demo_share_token,
            createdAt=datetime.utcnow().isoformat()
        )

        self.analyses[demo_analysis_id] = demo_analysis

        # Demo Shared Profile
        self.shared_profiles[demo_share_token] = SharedProfilePublicView(
            shareToken=demo_share_token,
            roleTitle="Machine Learning Engineer",
            jobCompany="AI Nexus Corp",
            readinessScore=78.0,
            topStrengths=["Python", "PyTorch", "SQL", "Machine Learning", "RAG"],
            topMatchedSkills=["Python", "PyTorch", "SQL", "Scikit-Learn", "PostgreSQL"],
            aiStrengthSummary="Demonstrated strong production capability in deep learning model training, scalable SQL data pipelines, and semantic search architectures.",
            createdAt=datetime.utcnow().isoformat(),
            isActive=True
        )

        # Demo Gamification Streak
        self.streaks[demo_user_id] = StreakInfo(
            currentStreakDays=5,
            roadmapStepsCompleted=2,
            earnedBadges=[
                {"id": "python_master", "name": "Python Verified", "icon": "🐍", "desc": "Strong verified Python evidence"},
                {"id": "first_roadmap", "name": "Roadmap Initiator", "icon": "🚀", "desc": "Completed first roadmap milestone"}
            ],
            nextMilestone="'Docker Ready' Badge (1 step away)"
        )

    # Repository Methods
    def get_analysis(self, analysis_id: str) -> Optional[FullAnalysisResult]:
        return self.analyses.get(analysis_id)

    def save_analysis(self, analysis: FullAnalysisResult):
        self.analyses[analysis.id] = analysis

    def get_resume(self, resume_id: str) -> Optional[ResumeModel]:
        return self.resumes.get(resume_id)

    def save_resume(self, resume: ResumeModel):
        self.resumes[resume.id] = resume

    def list_resumes(self, user_id: str) -> List[ResumeModel]:
        return list(self.resumes.values())

    def get_job(self, job_id: str) -> Optional[JobModel]:
        return self.jobs.get(job_id)

    def save_job(self, job: JobModel):
        self.jobs[job.id] = job

    def list_jobs(self, user_id: str) -> List[JobModel]:
        return list(self.jobs.values())

    def list_analyses(self, user_id: str) -> List[FullAnalysisResult]:
        return list(self.analyses.values())

    def get_interview_session(self, session_id: str) -> Optional[InterviewSessionModel]:
        return self.interview_sessions.get(session_id)

    def save_interview_session(self, session: InterviewSessionModel):
        self.interview_sessions[session.id] = session

    def get_streak(self, user_id: str) -> StreakInfo:
        return self.streaks.get(user_id, StreakInfo(
            currentStreakDays=1,
            roadmapStepsCompleted=0,
            earnedBadges=[],
            nextMilestone="Complete 1 roadmap step"
        ))

    def update_streak(self, user_id: str, streak: StreakInfo):
        self.streaks[user_id] = streak

    def get_shared_profile(self, token: str) -> Optional[SharedProfilePublicView]:
        profile = self.shared_profiles.get(token)
        if profile and profile.isActive:
            return profile
        return None

    def save_shared_profile(self, profile: SharedProfilePublicView):
        self.shared_profiles[profile.shareToken] = profile

    def revoke_shared_profile(self, token: str):
        if token in self.shared_profiles:
            self.shared_profiles[token].isActive = False

firebase_service = FirebaseService()
