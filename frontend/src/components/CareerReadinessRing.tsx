import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, AlertTriangle, Award, Sparkles, TrendingUp, Info } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface CareerReadinessRingProps {
  score: number;
  matchedCount: number;
  missingCount: number;
  weakCount: number;
  criticalCount: number;
  analysisId?: string;
  roleTitle?: string;
}

export const CareerReadinessRing: React.FC<CareerReadinessRingProps> = ({
  score,
  matchedCount,
  missingCount,
  weakCount,
  criticalCount,
  analysisId = 'demo-analysis-ml-01',
  roleTitle = 'Machine Learning Engineer'
}) => {
  const navigate = useNavigate();
  const { activeHex } = useTheme();
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  const radius = 58;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * score) / 100;

  const handlePillClick = (filterTab: string) => {
    navigate(`/analysis/${analysisId}?tab=matrix&filter=${filterTab}`);
  };

  return (
    <div className="p-6 rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md flex flex-col items-center justify-between space-y-6 shadow-xl relative group">
      
      {/* Card Header */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800/60">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            <span>AI Career Readiness Index</span>
          </span>
          <h3 className="text-sm font-bold text-white mt-0.5">{roleTitle}</h3>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>+14% MoM</span>
        </div>
      </div>

      {/* Main Interactive Ring */}
      <div className="relative w-44 h-44 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
          {/* Background Track */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Value Stroke */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke={activeHex}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Readout */}
        <div className="absolute text-center space-y-0.5">
          <span className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            {Math.round(score)}%
          </span>
          <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Job Ready
          </span>
          <span className="inline-block text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
            Ready to Apply
          </span>
        </div>
      </div>

      {/* Hover Info Tooltip Note */}
      {hoveredSegment && (
        <div className="text-xs text-slate-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 animate-fade-in text-center">
          {hoveredSegment === 'matched' && `Top strengths: Python, PyTorch, SQL, RAG`}
          {hoveredSegment === 'missing' && `Top missing requirements: Docker, FastAPI`}
          {hoveredSegment === 'weak' && `Weakly cited: AWS, PostgreSQL scale`}
          {hoveredSegment === 'critical' && `2 high-impact gaps required for this role`}
        </div>
      )}

      {/* Surrounding Breakdown Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full pt-1">
        <button
          onClick={() => handlePillClick('Matched')}
          onMouseEnter={() => setHoveredSegment('matched')}
          onMouseLeave={() => setHoveredSegment(null)}
          className="p-2.5 rounded-2xl bg-slate-950/70 hover:bg-slate-900 border border-slate-800/80 hover:border-emerald-500/30 transition text-center cursor-pointer group/pill"
        >
          <div className="flex items-center justify-center gap-1 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{matchedCount}</span>
          </div>
          <span className="text-[10px] text-slate-400 group-hover/pill:text-slate-200 block mt-0.5 font-medium">
            Matched
          </span>
        </button>

        <button
          onClick={() => handlePillClick('Missing')}
          onMouseEnter={() => setHoveredSegment('missing')}
          onMouseLeave={() => setHoveredSegment(null)}
          className="p-2.5 rounded-2xl bg-slate-950/70 hover:bg-slate-900 border border-slate-800/80 hover:border-rose-500/30 transition text-center cursor-pointer group/pill"
        >
          <div className="flex items-center justify-center gap-1 text-rose-400 font-bold text-sm">
            <XCircle className="w-3.5 h-3.5" />
            <span>{missingCount}</span>
          </div>
          <span className="text-[10px] text-slate-400 group-hover/pill:text-slate-200 block mt-0.5 font-medium">
            Missing
          </span>
        </button>

        <button
          onClick={() => handlePillClick('Weak')}
          onMouseEnter={() => setHoveredSegment('weak')}
          onMouseLeave={() => setHoveredSegment(null)}
          className="p-2.5 rounded-2xl bg-slate-950/70 hover:bg-slate-900 border border-slate-800/80 hover:border-amber-500/30 transition text-center cursor-pointer group/pill"
        >
          <div className="flex items-center justify-center gap-1 text-amber-400 font-bold text-sm">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{weakCount}</span>
          </div>
          <span className="text-[10px] text-slate-400 group-hover/pill:text-slate-200 block mt-0.5 font-medium">
            Weak Evidence
          </span>
        </button>

        <button
          onClick={() => handlePillClick('Critical')}
          onMouseEnter={() => setHoveredSegment('critical')}
          onMouseLeave={() => setHoveredSegment(null)}
          className="p-2.5 rounded-2xl bg-slate-950/70 hover:bg-slate-900 border border-slate-800/80 hover:border-blue-500/30 transition text-center cursor-pointer group/pill"
        >
          <div className="flex items-center justify-center gap-1 text-blue-400 font-bold text-sm">
            <Award className="w-3.5 h-3.5" />
            <span>{criticalCount}</span>
          </div>
          <span className="text-[10px] text-slate-400 group-hover/pill:text-slate-200 block mt-0.5 font-medium">
            Critical Gaps
          </span>
        </button>
      </div>
    </div>
  );
};
