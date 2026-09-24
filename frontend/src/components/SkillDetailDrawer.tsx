import React from 'react';
import { SkillAnalysisItem } from '../types';
import { X, ExternalLink, BookOpen, Layers, CheckCircle2, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SkillDetailDrawerProps {
  skill: SkillAnalysisItem | null;
  onClose: () => void;
  analysisId?: string;
}

export const SkillDetailDrawer: React.FC<SkillDetailDrawerProps> = ({ skill, onClose, analysisId }) => {
  if (!skill) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md border-l border-slate-800 bg-slate-950 p-6 flex flex-col justify-between overflow-y-auto shadow-2xl">
          <div className="space-y-6">
            
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                  Skill Breakdown & Action Plan
                </span>
                <h3 className="text-xl font-bold text-white mt-1">{skill.skill}</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Badges Overview */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Status</span>
                <div className="mt-1 font-semibold text-sm flex items-center gap-1.5">
                  {skill.status === 'Matched' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {skill.status === 'Missing' && <XCircle className="w-4 h-4 text-rose-400" />}
                  {skill.status === 'Weak' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                  <span className={
                    skill.status === 'Matched' ? 'text-emerald-400' :
                    skill.status === 'Missing' ? 'text-rose-400' : 'text-amber-400'
                  }>
                    {skill.status}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Importance</span>
                <div className="mt-1 font-semibold text-sm text-slate-200">
                  {skill.importance} Priority
                </div>
              </div>
            </div>

            {/* Why It Matters */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Why It Matters
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                {skill.whyItMatters}
              </p>
            </div>

            {/* Current Evidence */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Current Resume Evidence
              </h4>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Strength Level:</span>
                  <span className="font-semibold text-blue-400">{skill.evidenceLevel}</span>
                </div>
                {skill.matchedResumeText ? (
                  <div className="mt-2 text-xs italic text-slate-300 bg-slate-950/70 p-2.5 rounded-lg border-l-2 border-blue-500">
                    "{skill.matchedResumeText}"
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    No relevant practical demonstration or project citations found in the uploaded resume.
                  </p>
                )}
              </div>
            </div>

            {/* Recommended Action */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Recommended Action
              </h4>
              <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/20 space-y-2 text-xs text-slate-200">
                <p>{skill.recommendation || `Build a hands-on project to demonstrate ${skill.skill} with measurable results.`}</p>
              </div>
            </div>

            {/* Learning Resource Quick Link */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                <span>Verified Learning Resources</span>
              </h4>
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(skill.skill + ' developer tutorial documentation')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/30 text-xs text-slate-200 transition group"
              >
                <span>Explore {skill.skill} Official Guides & Tutorials</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-400 transition" />
              </a>
            </div>
          </div>

          {/* Bottom Action */}
          <div className="pt-6 border-t border-slate-800">
            {analysisId && (
              <Link
                to={`/roadmaps/${analysisId}`}
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition"
              >
                <span>View Full Roadmap Step</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
