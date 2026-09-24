import React from 'react';
import { ScoreBreakdown } from '../types';
import { Award, CheckCircle2, ShieldCheck, Target } from 'lucide-react';

export const ScoreBreakdownCard: React.FC<{ breakdown: ScoreBreakdown; overallScore: number }> = ({ breakdown, overallScore }) => {
  const items = [
    {
      title: 'Critical Skills',
      score: breakdown.criticalSkills,
      max: breakdown.criticalMax,
      weight: '40% weight',
      desc: 'Must-have core engineering requirements.',
      color: 'bg-red-500'
    },
    {
      title: 'High Priority',
      score: breakdown.highPriority,
      max: breakdown.highMax,
      weight: '30% weight',
      desc: 'Significant technical & framework proficiencies.',
      color: 'bg-orange-500'
    },
    {
      title: 'Medium Priority',
      score: breakdown.mediumPriority,
      max: breakdown.mediumMax,
      weight: '20% weight',
      desc: 'Secondary tooling & infrastructure familiarities.',
      color: 'bg-blue-500'
    },
    {
      title: 'Evidence Strength',
      score: breakdown.evidenceStrength,
      max: breakdown.evidenceMax,
      weight: '10% weight',
      desc: 'Quality of verified projects, metrics, and citations.',
      color: 'bg-emerald-500'
    }
  ];

  return (
    <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
            Transparent Score Calculation
          </span>
          <h3 className="text-lg font-bold text-white mt-0.5">Readiness Score Breakdown</h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Readiness</span>
            <div className="text-2xl font-black text-blue-400">{overallScore}%</div>
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
                  <span className="font-bold text-slate-200">{item.title}</span>
                  <span className="text-[10px] text-slate-500 font-medium">({item.weight})</span>
                </div>
                <div className="font-semibold text-slate-300">
                  <span className="text-blue-400 font-bold">{item.score}</span> / {item.max} pts
                </div>
              </div>

              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full ${item.color} rounded-full transition-all duration-500`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-400">{item.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs text-slate-300 leading-relaxed">
        <span className="font-semibold text-blue-300">Explainability Guarantee: </span>
        Scores are calculated strictly from verifiable requirement weights and evidence depth — never arbitrary keyword matches or opaque algorithms.
      </div>
    </div>
  );
};
