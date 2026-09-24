import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, AlertTriangle, Award, Sparkles, TrendingUp } from 'lucide-react';

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
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  const radius = 58;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * score) / 100;

  const handlePillClick = (filterTab: string) => {
    navigate(`/analysis/${analysisId}?tab=matrix&filter=${filterTab}`);
  };

  return (
    <div className="p-6 rounded-3xl border border-[#E7E5E4] bg-white flex flex-col items-center justify-between space-y-6 shadow-sm relative group">
      
      {/* Card Header */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-[#E7E5E4]">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#F97316] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 fill-[#F97316]" />
            <span>AI Career Readiness Index</span>
          </span>
          <h3 className="text-sm font-bold text-[#1C1917] mt-0.5">{roleTitle}</h3>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-[#DCFCE7] border border-[#16A34A]/20 text-[#16A34A] text-xs font-semibold flex items-center gap-1">
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
            stroke="#F5F5F4"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Value Stroke */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke="#F97316"
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
          <span className="text-3xl sm:text-4xl font-black tracking-tight text-[#1C1917]">
            {Math.round(score)}%
          </span>
          <span className="block text-[10px] font-bold uppercase tracking-widest text-[#78716C]">
            Job Ready
          </span>
          <span className="inline-block text-[10px] font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full border border-[#16A34A]/20">
            Ready to Apply
          </span>
        </div>
      </div>

      {/* Hover Info Tooltip Note */}
      {hoveredSegment && (
        <div className="text-xs text-[#1C1917] bg-[#FAFAFA] px-3 py-1.5 rounded-xl border border-[#E7E5E4] text-center shadow-sm">
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
          className="p-2.5 rounded-2xl bg-[#FAFAFA] hover:bg-[#F5F5F4] border border-[#E7E5E4] hover:border-[#16A34A]/40 transition text-center cursor-pointer group/pill"
        >
          <div className="flex items-center justify-center gap-1 text-[#16A34A] font-bold text-sm">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{matchedCount}</span>
          </div>
          <span className="text-[10px] text-[#78716C] group-hover/pill:text-[#1C1917] block mt-0.5 font-medium">
            Matched
          </span>
        </button>

        <button
          onClick={() => handlePillClick('Missing')}
          onMouseEnter={() => setHoveredSegment('missing')}
          onMouseLeave={() => setHoveredSegment(null)}
          className="p-2.5 rounded-2xl bg-[#FAFAFA] hover:bg-[#F5F5F4] border border-[#E7E5E4] hover:border-[#DC2626]/40 transition text-center cursor-pointer group/pill"
        >
          <div className="flex items-center justify-center gap-1 text-[#DC2626] font-bold text-sm">
            <XCircle className="w-3.5 h-3.5" />
            <span>{missingCount}</span>
          </div>
          <span className="text-[10px] text-[#78716C] group-hover/pill:text-[#1C1917] block mt-0.5 font-medium">
            Missing
          </span>
        </button>

        <button
          onClick={() => handlePillClick('Weak')}
          onMouseEnter={() => setHoveredSegment('weak')}
          onMouseLeave={() => setHoveredSegment(null)}
          className="p-2.5 rounded-2xl bg-[#FAFAFA] hover:bg-[#F5F5F4] border border-[#E7E5E4] hover:border-[#D97706]/40 transition text-center cursor-pointer group/pill"
        >
          <div className="flex items-center justify-center gap-1 text-[#D97706] font-bold text-sm">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{weakCount}</span>
          </div>
          <span className="text-[10px] text-[#78716C] group-hover/pill:text-[#1C1917] block mt-0.5 font-medium">
            Weak Evidence
          </span>
        </button>

        <button
          onClick={() => handlePillClick('Critical')}
          onMouseEnter={() => setHoveredSegment('critical')}
          onMouseLeave={() => setHoveredSegment(null)}
          className="p-2.5 rounded-2xl bg-[#FAFAFA] hover:bg-[#F5F5F4] border border-[#E7E5E4] hover:border-[#F97316]/40 transition text-center cursor-pointer group/pill"
        >
          <div className="flex items-center justify-center gap-1 text-[#F97316] font-bold text-sm">
            <Award className="w-3.5 h-3.5" />
            <span>{criticalCount}</span>
          </div>
          <span className="text-[10px] text-[#78716C] group-hover/pill:text-[#1C1917] block mt-0.5 font-medium">
            Critical Gaps
          </span>
        </button>
      </div>
    </div>
  );
};
