import React from 'react';
import { ProjectGapItem } from '../types';
import { X, Copy, Check, Terminal, Layers, CheckCircle2, Sparkles } from 'lucide-react';

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
        <div onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />

        <div className="relative transform overflow-hidden rounded-3xl border border-[#E7E5E4] bg-white p-6 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
          
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-[#E7E5E4]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F97316] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 fill-[#F97316]" />
                <span>Engineered Project Specification</span>
              </span>
              <h3 className="text-lg font-bold text-[#1C1917] mt-1">{project.title}</h3>
              <p className="text-xs text-[#78716C] mt-1">{project.description}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAFAFA] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 space-y-5 max-h-[70vh] overflow-y-auto pr-1">
            {/* Closes Skills & Difficulty */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-[#78716C] font-medium">Closes Skills:</span>
              {project.closesSkills.map((s, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-md text-xs font-semibold bg-[#FFF3E8] text-[#F97316] border border-[#F97316]/20">
                  {s}
                </span>
              ))}
              <span className="ml-auto px-2 py-0.5 rounded-md text-xs font-semibold bg-[#FAFAFA] text-[#1C1917] border border-[#E7E5E4]">
                {project.difficulty} • ~{project.estimatedDays} Days
              </span>
            </div>

            {/* Architecture Summary */}
            {project.architectureSummary && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#78716C] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#F97316]" />
                  <span>Architecture Overview</span>
                </h4>
                <div className="p-3.5 rounded-xl bg-[#FAFAFA] border border-[#E7E5E4] text-xs text-[#1C1917] font-mono leading-relaxed">
                  {project.architectureSummary}
                </div>
              </div>
            )}

            {/* Core Features */}
            {project.coreFeatures && project.coreFeatures.length > 0 && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#78716C] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Key Features to Implement</span>
                </h4>
                <div className="p-3.5 rounded-xl bg-[#FAFAFA] border border-[#E7E5E4] space-y-1.5 text-xs text-[#1C1917]">
                  {project.coreFeatures.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-[#16A34A] font-bold">✓</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Implementation Steps */}
            {project.implementationSteps && project.implementationSteps.length > 0 && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#78716C] flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>Step-by-Step Implementation</span>
                </h4>
                <div className="p-3.5 rounded-xl bg-[#FAFAFA] border border-[#E7E5E4] space-y-2 text-xs text-[#1C1917]">
                  {project.implementationSteps.map((step, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="font-bold text-[#F97316] shrink-0 font-mono">0{i + 1}.</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ready-to-use Resume Bullet */}
            {project.resumeBullet && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#78716C]">
                    Add to Resume Upon Completion:
                  </h4>
                  <button
                    onClick={handleCopyBullet}
                    className="text-xs font-bold text-[#F97316] hover:text-[#EA580C] flex items-center gap-1 transition cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied to Clipboard!' : 'Copy Bullet Point'}</span>
                  </button>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FFF3E8] border border-[#F97316]/20 text-xs italic text-[#1C1917] leading-relaxed">
                  "{project.resumeBullet}"
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-[#E7E5E4] flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold transition shadow-sm cursor-pointer"
            >
              Close Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
