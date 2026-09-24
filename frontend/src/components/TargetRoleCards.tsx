import React from 'react';
import { Link } from 'react-router-dom';
import { FullAnalysisResult } from '../types';
import { useDashboard } from '../context/DashboardContext';
import { Pin, ExternalLink } from 'lucide-react';

export const TargetRoleCards: React.FC<{ analyses: FullAnalysisResult[] }> = ({ analyses }) => {
  const { pinnedIds, togglePin } = useDashboard();

  if (!analyses || analyses.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#1C1917]">Target Roles Analyzed</h3>
        <Link to="/analyze" className="text-xs font-semibold text-[#F97316] hover:text-[#EA580C] transition">
          + Add Target Job
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {analyses.map((an) => {
          const isPinned = pinnedIds.includes(an.id);

          return (
            <div
              key={an.id}
              className="p-5 rounded-2xl border border-[#E7E5E4] bg-white hover:border-[#F97316]/50 transition space-y-4 shadow-sm group relative"
            >
              {/* Header & Pin Action */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#1C1917] group-hover:text-[#F97316] transition">
                      {an.jobTitle}
                    </span>
                    <span className="text-xs text-[#78716C] font-normal">• {an.jobCompany}</span>
                  </div>
                  <p className="text-xs text-[#78716C] line-clamp-1 mt-0.5">
                    Critical Gap: <strong className="text-[#DC2626]">{an.primaryGaps[0] || 'Docker'}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => togglePin(an.id)}
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      isPinned ? 'text-[#F97316] bg-[#FFF3E8]' : 'text-[#78716C] hover:text-[#1C1917]'
                    }`}
                    title={isPinned ? 'Unpin Role' : 'Pin to Sidebar'}
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>
                  
                  <div className="text-right pl-2 border-l border-[#E7E5E4]">
                    <span className="text-xl font-black text-[#1C1917]">{Math.round(an.readinessScore)}%</span>
                  </div>
                </div>
              </div>

              {/* Skills Breakdown Metrics */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-[#FAFAFA] border border-[#E7E5E4]">
                  <span className="font-bold text-[#16A34A]">{an.matchedCount}</span>
                  <span className="block text-[10px] text-[#78716C] font-medium">Matched</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAFAFA] border border-[#E7E5E4]">
                  <span className="font-bold text-[#DC2626]">{an.missingCount}</span>
                  <span className="block text-[10px] text-[#78716C] font-medium">Missing</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAFAFA] border border-[#E7E5E4]">
                  <span className="font-bold text-[#D97706]">{an.weakEvidenceCount}</span>
                  <span className="block text-[10px] text-[#78716C] font-medium">Weak Evidence</span>
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-[#E7E5E4]">
                <Link
                  to={`/analysis/${an.id}`}
                  className="text-xs font-bold text-[#F97316] hover:text-[#EA580C] flex items-center gap-1 transition"
                >
                  <span>View Full Analysis</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/roadmaps/${an.id}`}
                    className="text-[11px] font-semibold text-[#78716C] hover:text-[#1C1917]"
                  >
                    Roadmap
                  </Link>
                  <span className="text-[#E7E5E4]">•</span>
                  <Link
                    to={`/interview/${an.id}`}
                    className="text-[11px] font-semibold text-[#78716C] hover:text-[#1C1917]"
                  >
                    Interview
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
