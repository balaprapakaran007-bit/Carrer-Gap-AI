import React from 'react';
import { CheckCircle2, Circle, Sparkles, X, ArrowRight, Award } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { Link } from 'react-router-dom';

export const FirstRunChecklist: React.FC = () => {
  const { checklist, updateChecklist, dismissChecklist, isChecklistDismissed } = useDashboard();

  if (isChecklistDismissed) return null;

  const steps = [
    { key: 'uploadResume' as const, label: 'Upload your verified resume', link: '/analyze', linkText: 'Upload resume' },
    { key: 'analyzeJob' as const, label: 'Analyze your first target job description', link: '/analyze', linkText: 'Analyze job' },
    { key: 'reviewGaps' as const, label: 'Review your personalized skill gaps & readiness score', link: '#skills-section', linkText: 'View gaps' },
    { key: 'generateRoadmap' as const, label: 'Generate your step-by-step career roadmap', link: '/roadmaps/demo-analysis-ml-01', linkText: 'View roadmap' },
  ];

  const completedCount = Object.values(checklist).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);
  const isAllDone = completedCount === steps.length;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-sm transition-all">
      {/* Background decoration */}
      <div 
        className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: 'var(--primary)' }}
      />

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div 
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--primary)]/20"
            style={{ backgroundColor: 'var(--primary-muted)', color: 'var(--primary)' }}
          >
            {isAllDone ? <Award className="h-5 w-5 text-emerald-400" /> : <Sparkles className="h-5 w-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[var(--text-main)]">
                {isAllDone ? '🎉 Ready for Launch!' : 'Your Quick Start Checklist'}
              </h3>
              <span 
                className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                style={{ backgroundColor: 'var(--primary-muted)', color: 'var(--primary)' }}
              >
                {completedCount} of {steps.length} completed
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {isAllDone 
                ? 'All set! Your profile and gap intelligence are now fully configured.'
                : 'Complete these quick steps to unlock accurate gap scoring and AI coaching.'}
            </p>
          </div>
        </div>

        <button
          onClick={dismissChecklist}
          className="rounded-lg p-1.5 text-[var(--text-muted)] transition hover:bg-[var(--bg-card)] hover:text-[var(--text-main)]"
          title="Dismiss checklist"
          aria-label="Dismiss checklist"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 h-1.5 w-full rounded-full bg-[var(--border-subtle)] overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ 
            width: `${progressPercent}%`,
            backgroundColor: isAllDone ? '#10B981' : 'var(--primary)' 
          }}
        />
      </div>

      {/* Step Items */}
      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step) => {
          const isDone = checklist[step.key];
          return (
            <div
              key={step.key}
              className={`flex flex-col justify-between rounded-xl border p-3 transition ${
                isDone
                  ? 'border-emerald-500/20 bg-emerald-500/5'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[var(--border-strong)]'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <button
                  onClick={() => updateChecklist(step.key, !isDone)}
                  className="mt-0.5 text-left shrink-0 transition"
                  title={isDone ? 'Mark as incomplete' : 'Mark as done'}
                >
                  {isDone ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Circle className="h-4 w-4 text-[var(--text-muted)] hover:text-[var(--primary)]" />
                  )}
                </button>
                <span className={`text-xs font-medium leading-snug ${isDone ? 'text-emerald-300 line-through opacity-80' : 'text-[var(--text-main)]'}`}>
                  {step.label}
                </span>
              </div>

              {!isDone && (
                <div className="mt-2.5 pt-2 border-t border-[var(--border-subtle)] flex justify-end">
                  <Link
                    to={step.link}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold transition hover:underline"
                    style={{ color: 'var(--primary)' }}
                  >
                    <span>{step.linkText}</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
