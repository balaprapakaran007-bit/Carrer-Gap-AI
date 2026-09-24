import React from 'react';
import { ScoreBreakdown } from '../types';

export const ScoreBreakdownCard: React.FC<{ breakdown: ScoreBreakdown; overallScore: number }> = ({ breakdown, overallScore }) => {
  const items = [
    {
      title: 'Critical Skills',
      score: breakdown.criticalSkills,
      max: breakdown.criticalMax,
      weight: '40% weight',
      desc: 'Must-have core engineering requirements.',
      color: 'bg-[#DC2626]'
    },
    {
      title: 'High Priority',
      score: breakdown.highPriority,
      max: breakdown.highMax,
      weight: '30% weight',
      desc: 'Significant technical & framework proficiencies.',
      color: 'bg-[#F97316]'
    },
    {
      title: 'Medium Priority',
      score: breakdown.mediumPriority,
      max: breakdown.mediumMax,
      weight: '20% weight',
      desc: 'Secondary tooling & infrastructure familiarities.',
      color: 'bg-[#78716C]'
    },
    {
      title: 'Evidence Strength',
      score: breakdown.evidenceStrength,
      max: breakdown.evidenceMax,
      weight: '10% weight',
      desc: 'Quality of verified projects, metrics, and citations.',
      color: 'bg-[#16A34A]'
    }
  ];

  return (
    <div className="p-6 rounded-3xl border border-[#E7E5E4] bg-white shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E5E4]">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#F97316]">
            Transparent Score Calculation
          </span>
          <h3 className="text-lg font-bold text-[#1C1917] mt-0.5">Readiness Score Breakdown</h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-[#78716C] uppercase font-semibold">Total Readiness</span>
            <div className="text-2xl font-black text-[#F97316]">{overallScore}%</div>
          </div>
        </div>
      </div>

      {/* Breakdown Items */}
      <div className="space-y-4">
        {items.map((item, i) => {
          const percent = Math.round((item.score / item.max) * 100);
          return (
            <div key={i} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#1C1917]">{item.title}</span>
                  <span className="text-[10px] text-[#78716C] font-medium">({item.weight})</span>
                </div>
                <div className="font-semibold text-[#1C1917]">
                  <span className="text-[#F97316] font-bold">{item.score}</span> / {item.max} pts
                </div>
              </div>

              <div className="h-2 w-full rounded-full bg-[#E7E5E4] overflow-hidden">
                <div
                  className={`h-full ${item.color} rounded-full transition-all duration-500`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              <p className="text-[11px] text-[#78716C]">{item.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="p-3.5 rounded-2xl bg-[#FFF3E8] border border-[#F97316]/20 text-xs text-[#1C1917] leading-relaxed">
        <span className="font-bold text-[#F97316]">Explainability Guarantee: </span>
        Scores are calculated strictly from verifiable requirement weights and evidence depth — never arbitrary keyword matches or opaque algorithms.
      </div>
    </div>
  );
};
