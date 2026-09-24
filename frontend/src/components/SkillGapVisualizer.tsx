import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { ArrowUpDown, HelpCircle, Layers } from 'lucide-react';

interface SkillGapItem {
  skill: string;
  candidateScore: number;
  roleNeed: number;
  delta: number;
  category: string;
}

export const SkillGapVisualizer: React.FC<{ skillsData?: SkillGapItem[] }> = ({ skillsData }) => {
  const { activeHex } = useTheme();
  const [sortOrder, setSortOrder] = useState<'delta' | 'alpha'>('delta');

  const defaultSkills: SkillGapItem[] = [
    { skill: 'Docker', candidateScore: 15, roleNeed: 85, delta: -70, category: 'DevOps' },
    { skill: 'FastAPI', candidateScore: 40, roleNeed: 80, delta: -40, category: 'Backend' },
    { skill: 'AWS / Cloud', candidateScore: 20, roleNeed: 70, delta: -50, category: 'Cloud' },
    { skill: 'System Design', candidateScore: 45, roleNeed: 75, delta: -30, category: 'Architecture' },
    { skill: 'PyTorch', candidateScore: 85, roleNeed: 85, delta: 0, category: 'AI / ML' },
    { skill: 'SQL / PostgreSQL', candidateScore: 90, roleNeed: 80, delta: 10, category: 'Data Engineering' },
    { skill: 'Python', candidateScore: 95, roleNeed: 90, delta: 5, category: 'Programming' },
  ];

  const items = skillsData || defaultSkills;

  const sorted = [...items].sort((a, b) => {
    if (sortOrder === 'delta') {
      return a.delta - b.delta; // largest gaps first
    }
    return a.skill.localeCompare(b.skill);
  });

  return (
    <div className="p-6 rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md space-y-6 shadow-xl">
      
      {/* Header & Sort Controls */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/60">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
            Competency Delta Analysis
          </span>
          <h3 className="text-base font-bold text-white mt-0.5">Skill Gap Differential</h3>
        </div>

        <button
          onClick={() => setSortOrder(prev => prev === 'delta' ? 'alpha' : 'delta')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition"
        >
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span>Sort: {sortOrder === 'delta' ? 'Largest Gaps First' : 'Alphabetical'}</span>
        </button>
      </div>

      {/* Horizontal Comparative Bars */}
      <div className="space-y-4">
        {sorted.map((item, idx) => {
          const isGap = item.delta < 0;
          const deltaLabel = isGap ? `${item.delta} pts` : `+${item.delta} pts`;

          return (
            <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-100">{item.skill}</span>
                  <span className="text-[10px] text-slate-500">• {item.category}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  isGap ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {deltaLabel}
                </span>
              </div>

              {/* Dual Bars */}
              <div className="space-y-1.5">
                {/* Candidate Bar */}
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="w-20 text-slate-400 shrink-0">Your Level</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.candidateScore >= item.roleNeed ? 'bg-emerald-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${item.candidateScore}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-bold text-slate-300">{item.candidateScore}%</span>
                </div>

                {/* Role Need Bar */}
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="w-20 text-slate-400 shrink-0">Role Target</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-slate-600 rounded-full transition-all duration-500"
                      style={{ width: `${item.roleNeed}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-bold text-slate-400">{item.roleNeed}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
