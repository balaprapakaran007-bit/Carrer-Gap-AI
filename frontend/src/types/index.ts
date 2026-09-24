export type SkillStatus = 'Matched' | 'Missing' | 'Weak';
export type ImportanceLevel = 'Critical' | 'High' | 'Medium' | 'Optional';
export type EvidenceLevel = 'Strong' | 'Moderate' | 'Weak' | 'Not Demonstrated';
export type LearningResourceType = 'documentation' | 'youtube' | 'course' | 'article' | 'practice';

export interface LearningResourceItem {
  title: string;
  type: LearningResourceType;
  url: string;
  platform?: string;
  estimatedHours?: number;
  isFree: boolean;
}

export interface SkillAnalysisItem {
  skill: string;
  status: SkillStatus;
  importance: ImportanceLevel;
  evidenceLevel: EvidenceLevel;
  confidence: string;
  matchedResumeText?: string;
  whyItMatters: string;
  recommendation?: string;
  category?: string;
  demonstratedInProjects?: string[];
}

export interface RequirementItem {
  requirement: string;
  importance: ImportanceLevel;
  category: string;
  matched: boolean;
  evidence?: string;
}

export interface ScoreBreakdown {
  criticalSkills: number;
  criticalMax: number;
  highPriority: number;
  highMax: number;
  mediumPriority: number;
  mediumMax: number;
  evidenceStrength: number;
  evidenceMax: number;
  totalScore: number;
}

export interface ProjectGapItem {
  id?: string;
  title: string;
  description: string;
  closesSkills: string[];
  difficulty: string;
  estimatedDays: number;
  architectureSummary?: string;
  coreFeatures: string[];
  technologies: string[];
  implementationSteps: string[];
  resumeBullet: string;
}

export interface RoadmapStepItem {
  id: string;
  stepNumber: number;
  skill: string;
  title: string;
  reason: string;
  learningObjective: string;
  recommendedResources: LearningResourceItem[];
  practicalTask: string;
  estimatedHours: number;
  isCompleted: boolean;
  expectedImprovement: string;
}

export interface ResumeSuggestionItem {
  originalText?: string;
  improvedText: string;
  reason: string;
  targetedSkill: string;
}

export interface FullAnalysisResult {
  id: string;
  userId?: string;
  resumeId?: string;
  jobId?: string;
  jobTitle: string;
  jobCompany: string;
  readinessScore: number;
  scoreBreakdown: ScoreBreakdown;
  matchedCount: number;
  missingCount: number;
  weakEvidenceCount: number;
  criticalRequirementsCount: number;
  skillsMatrix: SkillAnalysisItem[];
  requirements: RequirementItem[];
  projectGaps: ProjectGapItem[];
  roadmap: RoadmapStepItem[];
  resumeSuggestions: ResumeSuggestionItem[];
  topStrengths: string[];
  primaryGaps: string[];
  summaryParagraph: string;
  isShareable: boolean;
  shareToken?: string;
  createdAt: string;
}

export interface AnalysisCompareResponse {
  previousAnalysisId: string;
  currentAnalysisId: string;
  previousScore: number;
  currentScore: number;
  scoreDiff: number;
  improvedSkills: {
    skill: string;
    previousStatus: string;
    currentStatus: string;
    currentEvidence: string;
  }[];
  remainingGaps: string[];
}

export interface InterviewQuestionItem {
  id: string;
  questionNumber: number;
  question: string;
  category: string;
  targetedSkill: string;
  expectedKeyPoints: string[];
  userAnswer?: string;
  scoreRelevance?: number;
  scoreDepth?: number;
  scoreClarity?: number;
  totalScore?: number;
  aiFeedback?: string;
  betterAnswerSnippet?: string;
}

export interface InterviewSessionModel {
  id: string;
  userId: string;
  analysisId: string;
  roleTitle: string;
  questions: InterviewQuestionItem[];
  overallReadinessSignal?: string;
  completedQuestionsCount: number;
  createdAt: string;
}

export interface BenchmarkRoleResponse {
  roleKey: string;
  roleTitle: string;
  sampleSize: number;
  avgReadiness: number;
  candidateScore: number;
  isEnoughData: boolean;
  aheadSkills: string[];
  behindSkills: string[];
  skillAverages: Record<string, number>;
}

export interface SharedProfilePublicView {
  shareToken: string;
  roleTitle: string;
  jobCompany: string;
  readinessScore: number;
  topStrengths: string[];
  topMatchedSkills: string[];
  aiStrengthSummary: string;
  createdAt: string;
  isActive: boolean;
}

export interface StreakInfo {
  currentStreakDays: number;
  roadmapStepsCompleted: number;
  earnedBadges: { id: string; name: string; icon: string; desc: string }[];
  nextMilestone: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
}
