import React from 'react';
import { SkillAnalysisItem } from '../types';
import { X, ExternalLink, BookOpen, CheckCircle2, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';
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
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md border-l border-[#E7E5E4] bg-white p-6 flex flex-col justify-between overflow-y-auto shadow-2xl">
          <div className="space-y-6">
            
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#E7E5E4]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#F97316]">
                  Skill Breakdown & Action Plan
                </span>
                <h3 className="text-xl font-bold text-[#1C1917] mt-1">{skill.skill}</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAFAFA] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Badges Overview */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-[#FAFAFA] border border-[#E7E5E4]">
                <span className="text-[10px] text-[#78716C] font-bold uppercase tracking-wider">Status</span>
                <div className="mt-1 font-semibold text-sm flex items-center gap-1.5">
                  {skill.status === 'Matched' && <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />}
                  {skill.status === 'Missing' && <XCircle className="w-4 h-4 text-[#DC2626]" />}
                  {skill.status === 'Weak' && <AlertTriangle className="w-4 h-4 text-[#D97706]" />}
                  <span className={
                    skill.status === 'Matched' ? 'text-[#16A34A]' :
                    skill.status === 'Missing' ? 'text-[#DC2626]' : 'text-[#D97706]'
                  }>
                    {skill.status}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#FAFAFA] border border-[#E7E5E4]">
                <span className="text-[10px] text-[#78716C] font-bold uppercase tracking-wider">Importance</span>
                <div className="mt-1 font-semibold text-sm text-[#1C1917]">
                  {skill.importance} Priority
                </div>
              </div>
            </div>

            {/* Why It Matters */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#78716C]">
                Why It Matters
              </h4>
              <p className="text-xs text-[#1C1917] leading-relaxed p-3.5 rounded-xl bg-[#FAFAFA] border border-[#E7E5E4]">
                {skill.whyItMatters}
              </p>
            </div>

            {/* Current Evidence */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#78716C]">
                Current Resume Evidence
              </h4>
              <div className="p-3.5 rounded-xl bg-[#FAFAFA] border border-[#E7E5E4] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#78716C]">Strength Level:</span>
                  <span className="font-semibold text-[#F97316]">{skill.evidenceLevel}</span>
                </div>
                {skill.matchedResumeText ? (
                  <div className="mt-2 text-xs italic text-[#1C1917] bg-white p-2.5 rounded-lg border-l-2 border-[#F97316]">
                    "{skill.matchedResumeText}"
                  </div>
                ) : (
                  <p className="text-xs text-[#78716C] italic">
                    No relevant practical demonstration or project citations found in the uploaded resume.
                  </p>
                )}
              </div>
            </div>

            {/* Recommended Action */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#78716C]">
                Recommended Action
              </h4>
              <div className="p-3.5 rounded-xl bg-[#FFF3E8] border border-[#F97316]/20 space-y-2 text-xs text-[#1C1917]">
                <p>{skill.recommendation || `Build a hands-on project to demonstrate ${skill.skill} with measurable results.`}</p>
              </div>
            </div>

            {/* Learning Resource Quick Link */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#78716C] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#F97316]" />
                <span>Verified Learning Resources</span>
              </h4>
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(skill.skill + ' developer tutorial documentation')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-[#FAFAFA] hover:bg-white border border-[#E7E5E4] hover:border-[#F97316]/40 text-xs text-[#1C1917] transition group"
              >
                <span>Explore {skill.skill} Official Guides & Tutorials</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#78716C] group-hover:text-[#F97316] transition" />
              </a>
            </div>
          </div>

          {/* Bottom Action */}
          <div className="pt-6 border-t border-[#E7E5E4]">
            {analysisId && (
              <Link
                to={`/roadmaps/${analysisId}`}
                onClick={onClose}
                className="w-full py-3 px-4 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-[#F97316]/20 transition cursor-pointer"
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
