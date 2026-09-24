import React, { useState } from 'react';
import { Sparkles, RefreshCw, ThumbsUp, ThumbsDown, ArrowRight, Lightbulb, Check } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

interface AICareerInsightCardProps {
  insightText?: string;
  recommendedProjectTitle?: string;
  onOpenProject?: () => void;
}

export const AICareerInsightCard: React.FC<AICareerInsightCardProps> = ({
  insightText = "Your strongest alignment is in Python, SQL and RAG. Your biggest opportunity is deployment experience. Building one Docker + FastAPI project could close two high-priority gaps simultaneously.",
  recommendedProjectTitle = "Enterprise Document QA with Docker & FastAPI",
  onOpenProject
}) => {
  const { isDemoMode } = useDashboard();
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentText, setCurrentText] = useState(insightText);

  const alternateInsights = [
    "Your strongest alignment is in Python, SQL and RAG. Your biggest opportunity is deployment experience. Building one Docker + FastAPI project could close two high-priority gaps simultaneously.",
    "Fastest path to 85% readiness: complete the Docker deployment milestone (+8 pts) and publish your PyTorch fine-tuning benchmark to GitHub (+5 pts).",
    "Analysis shows your weak evidence in CI/CD pipelines is holding back your target Machine Learning Engineer match score. Adding GitHub Actions to your RAG repo fixes this instantly."
  ];

  const handleRefresh = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setTimeout(() => {
      const remaining = alternateInsights.filter(i => i !== currentText);
      const next = remaining[Math.floor(Math.random() * remaining.length)] || alternateInsights[0];
      setCurrentText(next);
      setIsRefreshing(false);
    }, 600);
  };

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(prev => (prev === type ? null : type));
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-sm transition-all hover:border-[var(--primary)]/40 group">
      {/* Subtle background glow */}
      <div 
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl opacity-10 transition-opacity group-hover:opacity-20"
        style={{ backgroundColor: 'var(--primary)' }}
      />

      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div 
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--primary)]/20"
            style={{ backgroundColor: 'var(--primary-muted)', color: 'var(--primary)' }}
          >
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              AI Career Intelligence
            </h3>
            <p className="text-sm font-semibold text-[var(--text-main)]">
              Strategic Insight & Next Leverage
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-muted)] transition hover:text-[var(--text-main)] hover:border-[var(--border-strong)] disabled:opacity-50"
            title="Regenerate strategic insight"
            aria-label="Regenerate insight"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          {/* Feedback buttons */}
          <button
            onClick={() => handleFeedback('up')}
            className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
              feedback === 'up'
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
            title="Helpful insight"
            aria-label="Helpful insight"
          >
            <ThumbsUp className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => handleFeedback('down')}
            className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
              feedback === 'down'
                ? 'border-rose-500/40 bg-rose-500/10 text-rose-400'
                : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
            title="Not helpful"
            aria-label="Not helpful"
          >
            <ThumbsDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Insight Text */}
      <div className="relative rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 text-sm leading-relaxed text-[var(--text-main)]">
        <p className="font-normal italic">
          "{currentText}"
        </p>

        {feedback && (
          <p className="mt-2 text-[11px] font-medium text-emerald-400 flex items-center gap-1">
            <Check className="h-3 w-3" /> Feedback recorded to tune future coaching logic.
          </p>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
          <Lightbulb className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <span>Recommended Project Blueprint: <strong className="text-[var(--text-main)]">{recommendedProjectTitle}</strong></span>
        </div>

        <button
          onClick={onOpenProject}
          className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:opacity-90"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          <span>View Recommended Project</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
