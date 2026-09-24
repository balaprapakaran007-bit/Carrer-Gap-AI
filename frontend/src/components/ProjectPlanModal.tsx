import React from 'react';
import { ProjectGapItem } from '../types';
import { X, Copy, Check, Terminal, Layers, Code, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';

interface ProjectPlanModalProps {
  project: ProjectGapItem | null;
  onClose: () => void;
}

export const ProjectPlanModal: React.FC<ProjectPlanModalProps> = ({ project, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!project) return null;

  const handleCopyBullet = () => {
    navigator.clipboard.writeText(project.resumeBullet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" />

        <div className="relative transform overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-6 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
          
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                <span>Engineered Project Specification</span>
              </span>
              <h3 className="text-lg font-bold text-white mt-1">{project.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{project.description}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 space-y-5 max-h-[70vh] overflow-y-auto pr-1">
            {/* Closes Skills & Difficulty */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Closes Skills:</span>
              {project.closesSkills.map((s, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-md text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {s}
                </span>
              ))}
              <span className="ml-auto px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-800 text-slate-300">
                {project.difficulty} • ~{project.estimatedDays} Days
              </span>
            </div>

            {/* Architecture Summary */}
            {project.architectureSummary && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Architecture Overview</span>
                </h4>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 font-mono">
                  {project.architectureSummary}
                </div>
              </div>
            )}

            {/* Core Features */}
            {project.coreFeatures && project.coreFeatures.length > 0 && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Key Features to Implement</span>
                </h4>
                <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                  {project.coreFeatures.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Implementation Steps */}
            {project.implementationSteps && project.implementationSteps.length > 0 && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  <span>Step-by-Step Implementation</span>
                </h4>
                <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-2 text-xs text-slate-300">
                  {project.implementationSteps.map((step, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-400 text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ready-to-use Resume Bullet */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-blue-400" />
                  <span>Resume Bullet After Building</span>
                </h4>
                <button
                  onClick={handleCopyBullet}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Bullet'}</span>
                </button>
              </div>
              <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/30 text-xs italic text-blue-100 font-medium leading-relaxed">
                "{project.resumeBullet}"
              </div>
            </div>
          </div>

          {/* Footer Close */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition"
            >
              Close Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
