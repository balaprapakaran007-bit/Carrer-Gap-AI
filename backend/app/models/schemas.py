from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum
from datetime import datetime

class SkillStatus(str, Enum):
    MATCHED = "Matched"
    MISSING = "Missing"
    WEAK = "Weak"

class ImportanceLevel(str, Enum):
    CRITICAL = "Critical"
    HIGH = "High"
    MEDIUM = "Medium"
    OPTIONAL = "Optional"

class EvidenceLevel(str, Enum):
    STRONG = "Strong"
    MODERATE = "Moderate"
    WEAK = "Weak"
    NOT_DEMONSTRATED = "Not Demonstrated"

class LearningResourceType(str, Enum):
    DOCUMENTATION = "documentation"
    YOUTUBE = "youtube"
    COURSE = "course"
    ARTICLE = "article"
    PRACTICE = "practice"

# Learning Resource Schema
class LearningResourceItem(BaseModel):
    title: str
    type: LearningResourceType
    url: str
    platform: Optional[str] = None
    estimatedHours: Optional[float] = 4.0
    isFree: bool = True

# Skill and Requirement Schemas
class SkillAnalysisItem(BaseModel):
    skill: str
    status: SkillStatus
    importance: ImportanceLevel
    evidenceLevel: EvidenceLevel
    confidence: str = "High"  # High, Medium, Low
    matchedResumeText: Optional[str] = None
    whyItMatters: str
    recommendation: Optional[str] = None
    category: Optional[str] = "General"
    demonstratedInProjects: List[str] = Field(default_factory=list)

class RequirementItem(BaseModel):
    requirement: str
    importance: ImportanceLevel
    category: str
    matched: bool = False
    evidence: Optional[str] = None

class ScoreBreakdown(BaseModel):
    criticalSkills: float
    criticalMax: float = 40.0
    highPriority: float
    highMax: float = 30.0
    mediumPriority: float
    mediumMax: float = 20.0
    evidenceStrength: float
    evidenceMax: float = 10.0
    totalScore: float

class ProjectGapItem(BaseModel):
    id: Optional[str] = None
    title: str
    description: str
    closesSkills: List[str]
    difficulty: str  # Beginner, Intermediate, Advanced
    estimatedDays: int
    architectureSummary: Optional[str] = None
    coreFeatures: List[str] = Field(default_factory=list)
    technologies: List[str] = Field(default_factory=list)
    implementationSteps: List[str] = Field(default_factory=list)
    resumeBullet: str

class RoadmapStepItem(BaseModel):
    id: str
    stepNumber: int
    skill: str
    title: str
    reason: str
    learningObjective: str
    recommendedResources: List[LearningResourceItem] = Field(default_factory=list)
    practicalTask: str
    estimatedHours: float
    isCompleted: bool = False
    expectedImprovement: str

# Resume & Job Schemas
class ResumeUploadResponse(BaseModel):
    id: str
    fileName: str
    extractedText: str
    detectedSkills: List[str]
    version: int = 1
    createdAt: str

class ResumeModel(BaseModel):
    id: str
    userId: str
    fileName: str
    storagePath: Optional[str] = None
    parsedText: str
    skills: List[str] = Field(default_factory=list)
    version: int = 1
    createdAt: str

class JobCreateRequest(BaseModel):
    title: str
    company: Optional[str] = "Target Company"
    description: str
    sourceUrl: Optional[str] = None

class JobURLFetchRequest(BaseModel):
    url: str

class JobURLFetchResponse(BaseModel):
    url: str
    title: Optional[str] = None
    company: Optional[str] = None
    extractedText: str
    detectedRequirementsCount: int

class JobModel(BaseModel):
    id: str
    userId: str
    title: str
    company: Optional[str] = None
    description: str
    requirements: List[RequirementItem] = Field(default_factory=list)
    sourceUrl: Optional[str] = None
    createdAt: str

# Full Analysis Schemas
class AnalysisCreateRequest(BaseModel):
    resumeId: Optional[str] = None
    resumeText: Optional[str] = None
    resumeFileName: Optional[str] = "Uploaded Resume.pdf"
    jobId: Optional[str] = None
    jobText: Optional[str] = None
    jobTitle: Optional[str] = "Target Role"
    jobCompany: Optional[str] = "Company"
    isDemo: bool = False

class ResumeSuggestionItem(BaseModel):
    originalText: Optional[str] = None
    improvedText: str
    reason: str
    targetedSkill: str

class FullAnalysisResult(BaseModel):
    id: str
    userId: Optional[str] = "demo_user"
    resumeId: Optional[str] = None
    jobId: Optional[str] = None
    jobTitle: str
    jobCompany: str
    readinessScore: float
    scoreBreakdown: ScoreBreakdown
    matchedCount: int
    missingCount: int
    weakEvidenceCount: int
    criticalRequirementsCount: int
    skillsMatrix: List[SkillAnalysisItem]
    requirements: List[RequirementItem]
    projectGaps: List[ProjectGapItem]
    roadmap: List[RoadmapStepItem]
    resumeSuggestions: List[ResumeSuggestionItem]
    topStrengths: List[str]
    primaryGaps: List[str]
    summaryParagraph: str
    isShareable: bool = False
    shareToken: Optional[str] = None
    createdAt: str

class AnalysisCompareResponse(BaseModel):
    previousAnalysisId: str
    currentAnalysisId: str
    previousScore: float
    currentScore: float
    scoreDiff: float
    improvedSkills: List[Dict[str, Any]]
    remainingGaps: List[str]

# Multi-job comparison
class MultiJobCompareRequest(BaseModel):
    resumeText: str
    jobDescriptions: List[Dict[str, str]] # [{ "id": "1", "title": "...", "description": "..." }]

class MultiJobCompareResponse(BaseModel):
    commonSkills: List[str]
    commonGaps: List[str]
    roleSpecificGaps: Dict[str, List[str]] # { "Role A": ["NLP", "PyTorch"] }
    highestLeverageSkills: List[Dict[str, Any]] # [{ "skill": "Docker", "unblocksJobsCount": 3, "totalJobs": 4 }]

# Mock Interview Schemas
class InterviewQuestionItem(BaseModel):
    id: str
    questionNumber: int
    question: str
    category: str # "Technical Strength", "Technical Gap", "Behavioral Ownership", "System Design"
    targetedSkill: str
    expectedKeyPoints: List[str] = Field(default_factory=list)
    userAnswer: Optional[str] = None
    scoreRelevance: Optional[int] = None # 1 to 5
    scoreDepth: Optional[int] = None # 1 to 5
    scoreClarity: Optional[int] = None # 1 to 5
    totalScore: Optional[float] = None
    aiFeedback: Optional[str] = None
    betterAnswerSnippet: Optional[str] = None

class InterviewSessionCreateRequest(BaseModel):
    analysisId: str
    roleTitle: str
    matchedSkills: List[str]
    gapSkills: List[str]

class InterviewAnswerSubmitRequest(BaseModel):
    sessionId: str
    questionId: str
    userAnswer: str

class InterviewSessionModel(BaseModel):
    id: str
    userId: str
    analysisId: str
    roleTitle: str
    questions: List[InterviewQuestionItem]
    overallReadinessSignal: Optional[str] = "In Progress"
    completedQuestionsCount: int = 0
    createdAt: str

# Benchmarks
class BenchmarkRoleResponse(BaseModel):
    roleKey: str
    roleTitle: str
    sampleSize: int
    avgReadiness: float
    candidateScore: float
    isEnoughData: bool
    aheadSkills: List[str]
    behindSkills: List[str]
    skillAverages: Dict[str, float]

# Shared Public Profile
class SharedProfilePublicView(BaseModel):
    shareToken: str
    roleTitle: str
    jobCompany: str
    readinessScore: float
    topStrengths: List[str]
    topMatchedSkills: List[str]
    aiStrengthSummary: str
    createdAt: str
    isActive: bool

# Skill Progress & Gamification
class SkillProgressItem(BaseModel):
    skill: str
    status: SkillStatus
    progressPercent: int
    roadmapStepId: Optional[str] = None
    updatedAt: str

class StreakInfo(BaseModel):
    currentStreakDays: int
    roadmapStepsCompleted: int
    earnedBadges: List[Dict[str, str]]
    nextMilestone: str
