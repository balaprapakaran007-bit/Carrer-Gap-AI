import React, { useState } from 'react';
import { RoadmapStepItem } from '../types';
import {
  CheckCircle2,
  Circle,
  Clock,
  ExternalLink,
  BookOpen,
  Video,
  ArrowRight,
  Sparkles,
  Zap,
  HelpCircle,
  Layers,
  ChevronDown,
  ChevronUp,
  Award,
  ChevronRight,
  X,
  Code2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RoadmapTimelineProps {
  steps: RoadmapStepItem[];
  onToggleStep?: (stepId: string, isCompleted: boolean) => void;
  targetRoleTitle?: string;
}

export const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({
  steps,
  onToggleStep,
  targetRoleTitle = 'Machine Learning Engineer'
}) => {
  const [selectedDrawerStep, setSelectedDrawerStep] = useState<RoadmapStepItem | null>(null);
  const [expandedReasons, setExpandedReasons] = useState<Record<string, boolean>>({});

  const handleToggle = (stepId: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    if (nextStatus) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.75 }
      });
    }
    if (onToggleStep) {
      onToggleStep(stepId, nextStatus);
    }
  };

  const toggleReason = (stepId: string) => {
    setExpandedReasons(prev => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const completedCount = steps.filter((s) => s.isCompleted).length;
  const inProgressCount = steps.length > completedCount ? 1 : 0;
  const remainingCount = Math.max(0, steps.length - completedCount - inProgressCount);
  const progressPercent = Math.round((completedCount / (steps.length || 1)) * 100);
  const isAllComplete = completedCount === steps.length && steps.length > 0;

  // Identify current active milestone (first non-completed step)
  const currentActiveStepId = steps.find(s => !s.isCompleted)?.id;

  const scrollToStep = (id: string) => {
    const el = document.getElementById(`step-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* 1. ROADMAP OVERVIEW STRIP (Section 26) */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Roadmap Completion Status
              </span>
              <span 
                className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{ backgroundColor: 'var(--primary-soft)', color: 'var(--primary)' }}
              >
                {progressPercent}% Complete
              </span>
            </div>
            <h3 className="text-base font-bold text-[var(--text)] mt-0.5">
              {completedCount} of {steps.length} Milestones Completed
            </h3>
          </div>

          <div className="w-full sm:w-72 space-y-1.5">
            <div className="flex justify-between text-xs text-[var(--text-muted)] font-semibold">
              <span>Overall Progress</span>
              <span style={{ color: 'var(--primary)' }}>{progressPercent}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-[var(--surface-2)] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: isAllComplete ? 'var(--success)' : 'var(--primary)'
                }}
              />
            </div>
          </div>
        </div>

        {/* 4-Stat Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[var(--border)]">
          <div className="p-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
            <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block">Total Steps</span>
            <span className="text-sm font-bold text-[var(--text)]">{steps.length}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
            <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block">Completed</span>
            <span className="text-sm font-bold text-[var(--success)]">{completedCount}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
            <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block">In Progress</span>
            <span className="text-sm font-bold text-[var(--warning)]">{inProgressCount}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
            <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block">Remaining</span>
            <span className="text-sm font-bold text-[var(--text-muted)]">{remainingCount}</span>
          </div>
        </div>
      </div>

      {/* 2. STICKY STEP NAVIGATOR (Section 33) */}
      <div className="sticky top-16 z-20 py-2 bg-[var(--background)]/90 backdrop-blur-md border-y border-[var(--border)]">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] shrink-0 mr-1">
            Steps:
          </span>
          {steps.map((step, idx) => {
            const isCompleted = step.isCompleted;
            const isCurrent = step.id === currentActiveStepId;
            return (
              <button
                key={step.id || idx}
                onClick={() => scrollToStep(step.id)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition border ${
                  isCompleted
                    ? 'border-[var(--success)]/40 bg-[var(--success-soft)] text-[var(--success)]'
                    : isCurrent
                    ? 'border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)] shadow-sm'
                    : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3 h-3 text-[var(--success)]" />
                ) : isCurrent ? (
                  <Zap className="w-3 h-3 text-[var(--primary)]" />
                ) : (
                  <Circle className="w-3 h-3 text-[var(--text-muted)]" />
                )}
                <span>0{idx + 1} {step.skill}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. ROADMAP COMPLETE CELEBRATION (Section 34) */}
      {isAllComplete && (
        <div className="rounded-3xl border border-[var(--success)]/40 bg-[var(--success-soft)] p-8 text-center space-y-4 shadow-xl animate-in zoom-in-95 duration-300">
          <div className="w-14 h-14 rounded-2xl bg-[var(--success)] text-white flex items-center justify-center mx-auto shadow-lg shadow-[var(--success)]/30">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[var(--text)]">
              🎯 ROADMAP COMPLETE — YOU ARE JOB READY!
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-xl mx-auto mt-1">
              You have closed all critical skill gaps, built verified projects, and strengthened practical evidence for <strong>{targetRoleTitle}</strong>.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="/analyze"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition hover:opacity-95"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              Re-Analyze Updated Resume →
            </a>
            <a
              href="/dashboard"
              className="px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs font-semibold text-[var(--text)] hover:border-[var(--border-strong)] transition"
            >
              Return to Dashboard
            </a>
          </div>
        </div>
      )}

      {/* 4. VERTICAL TIMELINE WITH COMPLETED / CURRENT / UPCOMING STATES (Section 27, 28, 29, 30, 31) */}
      <div className="relative pl-6 sm:pl-10 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-[var(--border)]">
        {steps.map((step, idx) => {
          const isCompleted = step.isCompleted;
          const isCurrent = step.id === currentActiveStepId;
          const isReasonOpen = expandedReasons[step.id] ?? isCurrent;

          return (
            <div
              key={step.id || idx}
              id={`step-${step.id}`}
              className="relative group transition-all"
            >
              {/* Timeline Status Node (✓ / ⚡ / ○) */}
              <button
                onClick={() => handleToggle(step.id, step.isCompleted)}
                className={`absolute -left-6 sm:-left-10 top-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                  isCompleted
                    ? 'bg-[var(--success)] text-white shadow-lg shadow-[var(--success)]/20'
                    : isCurrent
                    ? 'border-2 text-white shadow-lg'
                    : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)]'
                }`}
                style={
                  isCurrent && !isCompleted
                    ? {
                        backgroundColor: 'var(--primary)',
                        borderColor: 'var(--primary)',
                        boxShadow: '0 0 16px var(--primary-glow)'
                      }
                    : {}
                }
                title={isCompleted ? 'Mark milestone as incomplete' : 'Mark milestone as completed'}
                aria-label={`Toggle step ${idx + 1}`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : isCurrent ? (
                  <Zap className="w-4 h-4" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
              </button>

              {/* Milestone Card (Section 28) */}
              <div
                className={`rounded-2xl border p-5 sm:p-6 transition-all space-y-4 ${
                  isCompleted
                    ? 'border-[var(--success)]/30 bg-[var(--success-soft)]/40'
                    : isCurrent
                    ? 'border-[var(--primary)] bg-[var(--surface)] shadow-lg'
                    : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)]'
                }`}
                style={isCurrent ? { boxShadow: '0 0 20px -5px var(--primary-soft)' } : {}}
              >
                {/* Header: Step Number, Skill, Priority, Estimated Time */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <span 
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border"
                      style={{
                        backgroundColor: isCurrent ? 'var(--primary-soft)' : 'var(--surface-2)',
                        borderColor: isCurrent ? 'var(--primary)' : 'var(--border)',
                        color: isCurrent ? 'var(--primary)' : 'var(--text-muted)'
                      }}
                    >
                      Step 0{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-[var(--text)]">• {step.skill}</span>
                    
                    {/* Semantic Priority Badge */}
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[var(--danger-soft)] text-[var(--danger)] border border-[var(--danger)]/20">
                      High Priority Gap
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>~{step.estimatedHours} hrs</span>
                    </span>

                    <button
                      onClick={() => setSelectedDrawerStep(step)}
                      className="p-1 rounded text-[var(--primary)] hover:underline text-xs font-semibold flex items-center gap-1"
                    >
                      <span>Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Title & Goal */}
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-4">
                    <h4 className={`text-base sm:text-lg font-bold transition ${isCompleted ? 'text-[var(--text-muted)] line-through' : 'text-[var(--text)]'}`}>
                      {step.title}
                    </h4>
                    
                    <button
                      onClick={() => handleToggle(step.id, step.isCompleted)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold transition shrink-0 ${
                        isCompleted
                          ? 'border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)]'
                          : 'text-white shadow-sm hover:opacity-90'
                      }`}
                      style={!isCompleted ? { backgroundColor: 'var(--primary)' } : {}}
                    >
                      {isCompleted ? 'Mark Incomplete' : 'Mark as Complete ✓'}
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                    {step.reason}
                  </p>
                </div>

                {/* 29. Practical Task Card */}
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--warning)] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Practical Hands-on Task</span>
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)] font-mono">Portfolio Proof</span>
                  </div>
                  <p className="text-xs font-medium text-[var(--text)] leading-relaxed">
                    {step.practicalTask}
                  </p>
                </div>

                {/* 30. AI Reasoning (Collapsible) */}
                <div className="pt-1">
                  <button
                    onClick={() => toggleReason(step.id)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-[var(--primary)] hover:underline"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{isReasonOpen ? 'Hide AI Gap Rationale' : 'Why this milestone matters for this role'}</span>
                    {isReasonOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  {isReasonOpen && (
                    <div className="mt-2 p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-xs text-[var(--text-muted)] leading-relaxed animate-in fade-in duration-150">
                      <strong>AI Career Coach Analysis:</strong> "{step.reason} Closing this gap adds measurable proof to your technical profile, satisfying target ATS filters and panel interview criteria."
                    </div>
                  )}
                </div>

                {/* 31. Grouped Learning Resources */}
                {step.recommendedResources && step.recommendedResources.length > 0 && (
                  <div className="pt-3 border-t border-[var(--border)] space-y-2">
                    <span className="text-xs font-bold text-[var(--text-muted)] flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" style={{ color: 'var(--primary)' }} />
                      <span>Verified Learning Resources</span>
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {step.recommendedResources.map((res, rIdx) => (
                        <a
                          key={rIdx}
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-xs text-[var(--text)] transition hover:border-[var(--border-strong)] hover:bg-[var(--surface)] group"
                        >
                          <div className="flex items-center gap-2 truncate">
                            {res.type === 'youtube' ? (
                              <Video className="w-3.5 h-3.5 text-red-500 shrink-0" />
                            ) : (
                              <BookOpen className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" />
                            )}
                            <span className="truncate font-medium">{res.title}</span>
                          </div>
                          <span className="text-[11px] font-semibold text-[var(--primary)] shrink-0 ml-2 flex items-center gap-0.5 group-hover:underline">
                            {res.type === 'youtube' ? 'Watch' : 'Open'} ↗
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. MILESTONE DETAIL DRAWER (Section 32) */}
      {selectedDrawerStep && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={() => setSelectedDrawerStep(null)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md border-l border-[var(--border)] bg-[var(--surface)] p-6 flex flex-col justify-between overflow-y-auto shadow-2xl space-y-6">
              <div className="space-y-6">
                
                <div className="flex items-start justify-between pb-4 border-b border-[var(--border)]">
                  <div>
                    <span 
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: 'var(--primary-soft)', color: 'var(--primary)' }}
                    >
                      Milestone Deep Dive
                    </span>
                    <h3 className="text-lg font-bold text-[var(--text)] mt-1.5">{selectedDrawerStep.title}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedDrawerStep(null)}
                    className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Target Skill & Competency
                  </h4>
                  <p className="text-xs text-[var(--text)] p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]">
                    {selectedDrawerStep.skill} — High priority requirement for {targetRoleTitle}.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    AI Gap Analysis
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]">
                    {selectedDrawerStep.reason}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1">
                    <Code2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Implementation Task</span>
                  </h4>
                  <p className="text-xs text-[var(--text)] leading-relaxed p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]">
                    {selectedDrawerStep.practicalTask}
                  </p>
                </div>

                {selectedDrawerStep.expectedImprovement && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                      Expected Outcome & Proof
                    </h4>
                    <p className="text-xs text-[var(--success)] p-3 rounded-xl border border-[var(--success)]/20 bg-[var(--success-soft)]">
                      {selectedDrawerStep.expectedImprovement}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[var(--border)] flex gap-2">
                <button
                  onClick={() => {
                    handleToggle(selectedDrawerStep.id, selectedDrawerStep.isCompleted);
                    setSelectedDrawerStep(null);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-md transition hover:opacity-90"
                  style={{ backgroundColor: selectedDrawerStep.isCompleted ? 'var(--surface-2)' : 'var(--primary)' }}
                >
                  {selectedDrawerStep.isCompleted ? 'Mark as Incomplete' : 'Complete Milestone ✓'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
