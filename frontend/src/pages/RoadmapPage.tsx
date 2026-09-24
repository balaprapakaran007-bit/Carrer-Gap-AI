import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { RoadmapStepItem, FullAnalysisResult } from '../types';
import { RoadmapTimeline } from '../components/RoadmapTimeline';
import {
  MapPin,
  Sparkles,
  ArrowLeft,
  Flame,
  Award,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Share2
} from 'lucide-react';

export const RoadmapPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [steps, setSteps] = useState<RoadmapStepItem[]>([]);
  const [analysis, setAnalysis] = useState<FullAnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadRoadmap = async () => {
      try {
        setLoading(true);
        const [stepData, anData] = await Promise.all([
          api.getRoadmap(id || 'demo-analysis-ml-01'),
          api.getAnalysis(id || 'demo-analysis-ml-01').catch(() => null)
        ]);
        setSteps(stepData);
        setAnalysis(anData);
      } catch (err) {
        console.error('Error loading roadmap:', err);
      } finally {
        setLoading(false);
      }
    };
    loadRoadmap();
  }, [id]);

  const handleToggleStep = async (stepId: string, isCompleted: boolean) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === stepId ? { ...s, isCompleted } : s))
    );
    try {
      await api.toggleRoadmapStep(id || 'demo-analysis-ml-01', stepId, isCompleted);
    } catch (err) {
      console.error('Error updating roadmap step in backend/Firebase:', err);
    }
  };

  const targetRole = analysis?.jobTitle || 'Machine Learning Engineer';
  const targetCompany = analysis?.jobCompany || 'AI Nexus Corp';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* 1. ROADMAP HERO (Section 25) */}
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-sm space-y-4">
        {/* Glow */}
        <div 
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl opacity-15"
          style={{ backgroundColor: 'var(--primary)' }}
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <Link
            to={`/analysis/${id || 'demo-analysis-ml-01'}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text)] transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Analysis</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>5-Day Streak Active</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span 
              className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border"
              style={{
                backgroundColor: 'var(--primary-soft)',
                borderColor: 'var(--primary)',
                color: 'var(--primary)'
              }}
            >
              Personalized Career Roadmap
            </span>
            <span className="text-xs text-[var(--text-muted)] font-medium">
              Target: <strong className="text-[var(--text)]">{targetRole}</strong> at <strong className="text-[var(--text)]">{targetCompany}</strong>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
            Your shortest path from current skills to job-ready.
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
            Generated from: <strong>Resume Proof</strong> + <strong>Target Job Description</strong> + <strong>AI Skill Gap Engine</strong>. Execute milestones in sequence to close missing capabilities and strengthen verified evidence.
          </p>
        </div>
      </div>

      {/* 2. ROADMAP CONTENT */}
      {loading ? (
        <div className="p-16 text-center space-y-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto animate-pulse"
            style={{ backgroundColor: 'var(--primary-soft)', color: 'var(--primary)' }}
          >
            <Compass className="w-6 h-6 animate-spin" />
          </div>
          <p className="text-xs font-mono text-[var(--text-muted)]">Synthesizing personalized roadmap milestones...</p>
        </div>
      ) : (
        <RoadmapTimeline
          steps={steps}
          onToggleStep={handleToggleStep}
          targetRoleTitle={targetRole}
        />
      )}
    </div>
  );
};
