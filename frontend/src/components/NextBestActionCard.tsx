import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Zap, Clock, TrendingUp, ChevronDown, ChevronUp, History, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const NextBestActionCard: React.FC<{ analysisId?: string }> = ({ analysisId = 'demo-analysis-ml-01' }) => {
  const { activeHex } = useTheme();

  const actions = [
    {
      id: 'action-1',
      title: 'Complete Docker Fundamentals',
      skill: 'Docker',
      why: 'Docker is currently your highest-priority missing requirement for the Machine Learning Engineer role at AI Nexus Corp.',
      impact: '+8 readiness points',
      estimatedTime: '2 days (~6 hrs)',
      link: `/roadmaps/${analysisId}`
    },
    {
      id: 'action-2',
      title: 'Strengthen PostgreSQL & SQL Pipeline Evidence',
      skill: 'SQL Scale',
      why: 'Elevate your SQL relational database evidence by adding query optimization & latency metrics to your current resume bullets.',
      impact: '+4 readiness points',
      estimatedTime: '1 day (~3 hrs)',
      link: `/roadmaps/${analysisId}`
    },
    {
      id: 'action-3',
      title: 'Build Containerized RAG API Portfolio Project',
      skill: 'Docker + FastAPI',
      why: 'Simultaneously demonstrates Docker containerization and asynchronous REST APIs in a single deployable repository.',
      impact: '+12 readiness points',
      estimatedTime: '3 days (~10 hrs)',
      link: `/roadmaps/${analysisId}`
    }
  ];

  const [activeIdx, setActiveIdx] = useState(0);
  const [showHistory, setShowHistory] = useState(false);

  const currentAction = actions[activeIdx];

  return (
    <div className="p-6 rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-950/30 via-slate-900/90 to-slate-900/90 backdrop-blur-xl shadow-2xl space-y-6 relative overflow-hidden">
      
      {/* Glow Effect */}
      <div
        className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: activeHex }}
      />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>Your Next Best Action</span>
        </span>

        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
          High Impact
        </span>
      </div>

      {/* Main Recommended Action */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-white leading-snug">
            {currentAction.title}
          </h2>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            {currentAction.why}
          </p>
        </div>

        {/* Impact & Time Pills */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-blue-500/15 border border-blue-500/25 text-blue-300 text-xs font-bold flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Impact: {currentAction.impact}</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Effort: {currentAction.estimatedTime}</span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={currentAction.link}
          className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition transform hover:-translate-y-0.5"
          style={{ backgroundColor: activeHex }}
        >
          <span>Start Learning & Build Milestone</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Alternatives Switcher */}
      <div className="pt-3 border-t border-slate-800/80 space-y-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Or Choose An Alternative Path:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {actions.map((act, idx) => {
            if (idx === activeIdx) return null;
            return (
              <button
                key={act.id}
                onClick={() => setActiveIdx(idx)}
                className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-left text-xs text-slate-300 hover:text-white transition flex items-center justify-between"
              >
                <span className="truncate max-w-[200px]">{act.title}</span>
                <span className="text-[10px] text-blue-400 font-bold shrink-0 ml-1">Swap ↵</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Expandable Action History */}
      <div className="pt-1">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 font-semibold transition"
        >
          <History className="w-3.5 h-3.5" />
          <span>{showHistory ? 'Hide Recommendation History' : 'View Recommendation History'}</span>
          {showHistory ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {showHistory && (
          <div className="mt-3 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-300 pb-1 border-b border-slate-800/60">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span>PyTorch Model Pipeline Optimization</span>
              </span>
              <span className="text-[10px] text-slate-500">Completed (+14 pts)</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-blue-400">
                <span>RAG Semantic Search Ingestion</span>
              </span>
              <span className="text-[10px] text-slate-500">Completed (+8 pts)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
