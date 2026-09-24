import React from 'react';
import { Link } from 'react-router-dom';
import { FullAnalysisResult } from '../types';
import { useDashboard } from '../context/DashboardContext';
import { useTheme } from '../context/ThemeContext';
import {
  Sparkles, CheckCircle2, XCircle, AlertTriangle, Pin, MoreVertical,
  ExternalLink, Layers, RefreshCw
} from 'lucide-react';

export const TargetRoleCards: React.FC<{ analyses: FullAnalysisResult[] }> = ({ analyses }) => {
  const { pinnedIds, togglePin } = useDashboard();
  const { activeHex } = useTheme();

  if (!analyses || analyses.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white">Target Roles Analyzed</h3>
        <Link to="/analyze" className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition">
          + Add Target Job
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {analyses.map((an) => {
          const isPinned = pinnedIds.includes(an.id);

          return (
            <div
              key={an.id}
              className="p-5 rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md hover:border-slate-700 transition space-y-4 shadow-lg group relative"
            >
              {/* Header & Pin Action */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white group-hover:text-blue-400 transition">
                      {an.jobTitle}
                    </span>
                    <span className="text-xs text-slate-400 font-normal">• {an.jobCompany}</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                    Critical Gap: <strong className="text-rose-400">{an.primaryGaps[0] || 'Docker'}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => togglePin(an.id)}
                    className={`p-1.5 rounded-lg transition ${
                      isPinned ? 'text-blue-400 bg-blue-500/10' : 'text-slate-500 hover:text-slate-300'
                    }`}
                    title={isPinned ? 'Unpin Role' : 'Pin to Sidebar'}
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>
                  
                  <div className="text-right pl-2 border-l border-slate-800">
                    <span className="text-xl font-black text-white">{Math.round(an.readinessScore)}%</span>
                  </div>
                </div>
              </div>

              {/* Skills Breakdown Metrics */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="font-bold text-emerald-400">{an.matchedCount}</span>
                  <span className="block text-[10px] text-slate-500 font-medium">Matched</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="font-bold text-rose-400">{an.missingCount}</span>
                  <span className="block text-[10px] text-slate-500 font-medium">Missing</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="font-bold text-amber-400">{an.weakEvidenceCount}</span>
                  <span className="block text-[10px] text-slate-500 font-medium">Weak Evidence</span>
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                <Link
                  to={`/analysis/${an.id}`}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition"
                >
                  <span>View Full Analysis</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/roadmaps/${an.id}`}
                    className="text-[11px] font-semibold text-slate-400 hover:text-slate-200"
                  >
                    Roadmap
                  </Link>
                  <span className="text-slate-600">•</span>
                  <Link
                    to={`/interview/${an.id}`}
                    className="text-[11px] font-semibold text-slate-400 hover:text-slate-200"
                  >
                    Mock Interview
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
