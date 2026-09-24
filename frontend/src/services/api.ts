import {
  FullAnalysisResult, AnalysisCompareResponse, InterviewSessionModel,
  BenchmarkRoleResponse, SharedProfilePublicView, StreakInfo, ProjectGapItem, RoadmapStepItem
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const api = {
  // Resumes
  async uploadResume(formData: FormData) {
    const res = await fetch(`${API_BASE_URL}/resumes/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Upload failed' }));
      throw new Error(err.detail || 'Failed to upload and parse resume');
    }
    return res.json();
  },

  async listResumes() {
    const res = await fetch(`${API_BASE_URL}/resumes`);
    if (!res.ok) throw new Error('Failed to fetch resumes');
    return res.json();
  },

  // Jobs
  async createJob(payload: { title: string; company?: string; description: string; sourceUrl?: string }) {
    const res = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to create job' }));
      throw new Error(err.detail || 'Failed to process job description');
    }
    return res.json();
  },

  async fetchJobFromUrl(url: string) {
    const res = await fetch(`${API_BASE_URL}/jobs/from-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to fetch job URL' }));
      throw new Error(err.detail || 'Could not parse job posting from URL');
    }
    return res.json();
  },

  async listJobs() {
    const res = await fetch(`${API_BASE_URL}/jobs`);
    if (!res.ok) throw new Error('Failed to list jobs');
    return res.json();
  },

  // Analyses
  async createAnalysis(payload: {
    resumeId?: string;
    resumeText?: string;
    resumeFileName?: string;
    jobId?: string;
    jobText?: string;
    jobTitle?: string;
    jobCompany?: string;
    isDemo?: boolean;
  }): Promise<FullAnalysisResult> {
    const res = await fetch(`${API_BASE_URL}/analysis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Analysis failed' }));
      throw new Error(err.detail || 'Failed to run career gap analysis');
    }
    return res.json();
  },

  async createAnalysisStream(
    payload: {
      resumeId?: string;
      resumeText?: string;
      resumeFileName?: string;
      jobId?: string;
      jobText?: string;
      jobTitle?: string;
      jobCompany?: string;
      isDemo?: boolean;
    },
    onStageUpdate?: (data: { stage: string; message: string; step: number; total: number }) => void
  ): Promise<FullAnalysisResult> {
    const response = await fetch(`${API_BASE_URL}/analysis/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ detail: 'Analysis failed' }));
      throw new Error(err.detail || 'Failed to initiate analysis stream');
    }

    const reader = response.body?.getReader();
    if (!reader) {
      return this.createAnalysis(payload);
    }

    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let finalResult: FullAnalysisResult | null = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'stage' && onStageUpdate) {
              onStageUpdate({
                stage: data.stage,
                message: data.message,
                step: data.step,
                total: data.total
              });
            } else if (data.type === 'complete' && data.result) {
              finalResult = data.result;
            } else if (data.type === 'error') {
              throw new Error(data.message || 'Analysis processing failed');
            }
          } catch (e: any) {
            if (e.message && e.message.includes('Analysis processing failed')) throw e;
          }
        }
      }
    }

    if (finalResult) {
      return finalResult;
    }

    // Fallback if stream ended without explicit result object
    return this.createAnalysis(payload);
  },

  async getAnalysis(id: string): Promise<FullAnalysisResult> {
    const res = await fetch(`${API_BASE_URL}/analysis/${id}`);
    if (!res.ok) throw new Error('Analysis not found');
    return res.json();
  },

  async listAnalyses(): Promise<FullAnalysisResult[]> {
    const res = await fetch(`${API_BASE_URL}/analysis`);
    if (!res.ok) return [];
    return res.json();
  },

  async compareAnalysis(id: string, previousId?: string): Promise<AnalysisCompareResponse> {
    const url = previousId
      ? `${API_BASE_URL}/analysis/${id}/compare?previousId=${previousId}`
      : `${API_BASE_URL}/analysis/${id}/compare`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to compare analysis versions');
    return res.json();
  },

  async compareMultipleJobs(payload: {
    resumeText: string;
    jobDescriptions: { id: string; title: string; description: string }[];
  }) {
    const res = await fetch(`${API_BASE_URL}/analysis/multi-compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to compare multiple jobs');
    return res.json();
  },

  // Roadmap
  async getRoadmap(analysisId: string): Promise<RoadmapStepItem[]> {
    const res = await fetch(`${API_BASE_URL}/roadmap/${analysisId}`);
    if (!res.ok) throw new Error('Failed to load roadmap');
    return res.json();
  },

  async toggleRoadmapStep(analysisId: string, stepId: string, isCompleted: boolean) {
    const res = await fetch(`${API_BASE_URL}/roadmap/${analysisId}/step`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stepId, isCompleted }),
    });
    if (!res.ok) throw new Error('Failed to update roadmap step');
    return res.json();
  },

  // Projects
  async generateProjectPlan(missingSkills: string[], targetRole: string): Promise<ProjectGapItem[]> {
    const res = await fetch(`${API_BASE_URL}/projects/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ missingSkills, targetRole }),
    });
    if (!res.ok) throw new Error('Failed to generate project plans');
    return res.json();
  },

  // Mock Interview
  async generateInterviewSession(payload: {
    analysisId: string;
    roleTitle: string;
    matchedSkills: string[];
    gapSkills: string[];
  }): Promise<InterviewSessionModel> {
    const res = await fetch(`${API_BASE_URL}/interview/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to generate interview session');
    return res.json();
  },

  async getInterviewSession(id: string): Promise<InterviewSessionModel> {
    const res = await fetch(`${API_BASE_URL}/interview/${id}`);
    if (!res.ok) throw new Error('Interview session not found');
    return res.json();
  },

  async submitInterviewAnswer(sessionId: string, questionId: string, userAnswer: string) {
    const res = await fetch(`${API_BASE_URL}/interview/${sessionId}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId, userAnswer }),
    });
    if (!res.ok) throw new Error('Failed to score interview answer');
    return res.json();
  },

  // Benchmarks
  async getBenchmarks(roleKey: string): Promise<BenchmarkRoleResponse> {
    const res = await fetch(`${API_BASE_URL}/benchmarks/${roleKey}`);
    if (!res.ok) throw new Error('Failed to fetch benchmark data');
    return res.json();
  },

  // Public Profile Sharing
  async toggleShare(analysisId: string, enable: boolean) {
    const res = await fetch(`${API_BASE_URL}/share/${analysisId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enable }),
    });
    if (!res.ok) throw new Error('Failed to update public share settings');
    return res.json();
  },

  async getPublicProfile(token: string): Promise<SharedProfilePublicView> {
    const res = await fetch(`${API_BASE_URL}/share/${token}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Profile not found' }));
      throw new Error(err.detail || 'Shared profile is no longer available');
    }
    return res.json();
  },

  // Skills & Streaks
  async getSkillProgress(): Promise<{ skills: any[]; streak: StreakInfo }> {
    const res = await fetch(`${API_BASE_URL}/skills/progress`);
    if (!res.ok) throw new Error('Failed to load skill progress');
    return res.json();
  },

  async updateSkillProgress(skill: string, progressPercent: number, status: string) {
    const res = await fetch(`${API_BASE_URL}/skills/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skill, progressPercent, status }),
    });
    if (!res.ok) throw new Error('Failed to update skill progress');
    return res.json();
  }
};
