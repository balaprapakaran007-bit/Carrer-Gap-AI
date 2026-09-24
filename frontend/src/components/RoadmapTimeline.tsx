import React from 'react';
import { RoadmapStepItem } from '../types';
import { CheckCircle2, Circle, Clock, ExternalLink, BookOpen, Video, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RoadmapTimelineProps {
  steps: RoadmapStepItem[];
  onToggleStep?: (stepId: string, isCompleted: boolean) => void;
}

export const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({ steps, onToggleStep }) => {
  const handleToggle = (stepId: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    if (nextStatus) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
    if (onToggleStep) {
      onToggleStep(stepId, nextStatus);
    }
  };

  const completedCount = steps.filter((s) => s.isCompleted).length;
  const progressPercent = Math.round((completedCount / (steps.length || 1)) * 100);

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
            Roadmap Momentum
          </span>
          <h3 className="text-base font-bold text-slate-100 mt-0.5">
            {completedCount} of {steps.length} Milestones Completed
          </h3>
        </div>

        <div className="w-full sm:w-64 space-y-1.5">
          <div className="flex justify-between text-xs text-slate-400 font-semibold">
            <span>Progress</span>
            <span className="text-blue-400">{progressPercent}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
        {steps.map((step, idx) => {
          return (
            <div key={step.id || idx} className="relative group">
              {/* Timeline Node Icon / Checkbox */}
              <button
                onClick={() => handleToggle(step.id, step.isCompleted)}
                className={`absolute -left-6 sm:-left-8 top-1.5 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                  step.isCompleted
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-900 border border-slate-700 text-slate-400 hover:border-blue-500 hover:text-blue-400'
                }`}
                title={step.isCompleted ? 'Mark as Incomplete' : 'Mark Milestone Complete'}
              >
                {step.isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
              </button>

              {/* Step Card */}
              <div className={`p-5 rounded-2xl border transition-all ${
                step.isCompleted
                  ? 'border-emerald-500/30 bg-emerald-950/10'
                  : 'border-slate-800/80 bg-slate-900/40 hover:border-slate-700'
              }`}>
                {/* Step Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/20">
                      Step {step.stepNumber || idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">• {step.skill}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>~{step.estimatedHours} hrs</span>
                  </div>
                </div>

                {/* Title & Reason */}
                <div className="mt-3 space-y-1.5">
                  <h4 className={`text-base font-bold transition ${step.isCompleted ? 'text-emerald-300 line-through' : 'text-slate-100'}`}>
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {step.reason}
                  </p>
                </div>

                {/* Practical Task */}
                <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Practical Hands-on Task</span>
                  </span>
                  <p className="text-xs text-slate-200">{step.practicalTask}</p>
                </div>

                {/* Expected Improvement */}
                {step.expectedImprovement && (
                  <div className="mt-3 flex items-center gap-2 text-xs font-medium text-blue-400">
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>Expected Result: {step.expectedImprovement}</span>
                  </div>
                )}

                {/* Verified Learning Resources */}
                {step.recommendedResources && step.recommendedResources.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-800/60 space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                      <span>Verified Learning Resources</span>
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {step.recommendedResources.map((res, rIdx) => (
                        <a
                          key={rIdx}
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/30 text-xs text-slate-200 transition group"
                        >
                          <div className="flex items-center gap-2 truncate">
                            {res.type === 'youtube' ? (
                              <Video className="w-3.5 h-3.5 text-red-400 shrink-0" />
                            ) : (
                              <BookOpen className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                            )}
                            <span className="truncate">{res.title}</span>
                          </div>
                          <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-blue-400 shrink-0 transition ml-2" />
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
    </div>
  );
};
