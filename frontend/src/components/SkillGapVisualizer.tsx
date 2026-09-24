import React, { useState } from 'react';
import { ArrowUpDown } from 'lucide-react';

interface SkillGapItem {
  skill: string;
  candidateScore: number;
  roleNeed: number;
  delta: number;
  category: string;
}

export const SkillGapVisualizer: React.FC<{ skillsData?: SkillGapItem[] }> = ({ skillsData }) => {
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
    <div className="p-6 rounded-3xl border border-[#E7E5E4] bg-white space-y-6 shadow-sm">
      
      {/* Header & Sort Controls */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E7E5E4]">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#F97316]">
            Competency Delta Analysis
          </span>
          <h3 className="text-base font-bold text-[#1C1917] mt-0.5">Skill Gap Differential</h3>
        </div>

        <button
          onClick={() => setSortOrder(prev => prev === 'delta' ? 'alpha' : 'delta')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAFAFA] hover:bg-[#F5F5F4] border border-[#E7E5E4] text-xs font-semibold text-[#1C1917] transition cursor-pointer"
        >
          <ArrowUpDown className="w-3.5 h-3.5 text-[#78716C]" />
          <span>Sort: {sortOrder === 'delta' ? 'Largest Gaps First' : 'Alphabetical'}</span>
        </button>
      </div>

      {/* Horizontal Comparative Bars */}
      <div className="space-y-3">
        {sorted.map((item, idx) => {
          const isGap = item.delta < 0;
          const deltaLabel = isGap ? `${item.delta} pts` : `+${item.delta} pts`;

          return (
            <div key={idx} className="p-3.5 rounded-2xl bg-[#FAFAFA] border border-[#E7E5E4] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#1C1917]">{item.skill}</span>
                  <span className="text-[10px] text-[#78716C]">• {item.category}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  isGap ? 'bg-[#FEE2E2] text-[#DC2626] border border-[#DC2626]/20' : 'bg-[#DCFCE7] text-[#16A34A] border border-[#16A34A]/20'
                }`}>
                  {deltaLabel}
                </span>
              </div>

              {/* Dual Bars */}
              <div className="space-y-1.5">
                {/* Candidate Bar */}
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="w-20 text-[#78716C] shrink-0">Your Level</span>
                  <div className="flex-1 h-2 rounded-full bg-[#E7E5E4] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.candidateScore >= item.roleNeed ? 'bg-[#16A34A]' : 'bg-[#F97316]'
                      }`}
                      style={{ width: `${item.candidateScore}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-bold text-[#1C1917]">{item.candidateScore}%</span>
                </div>

                {/* Role Need Bar */}
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="w-20 text-[#78716C] shrink-0">Role Target</span>
                  <div className="flex-1 h-2 rounded-full bg-[#E7E5E4] overflow-hidden">
                    <div
                      className="h-full bg-[#A8A29E] rounded-full transition-all duration-500"
                      style={{ width: `${item.roleNeed}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-bold text-[#78716C]">{item.roleNeed}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
