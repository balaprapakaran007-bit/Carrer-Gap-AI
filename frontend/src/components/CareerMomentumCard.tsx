import React, { useState } from 'react';
import { Flame, Award, CheckCircle2, Zap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const CareerMomentumCard: React.FC = () => {
  const [markedToday, setMarkedToday] = useState(false);

  const phases = [
    { label: 'Profile Base', status: 'completed' },
    { label: 'Core Skills', status: 'completed' },
    { label: 'Portfolio Projects', status: 'active' },
    { label: 'Interview Ready', status: 'upcoming' },
    { label: 'Job Ready', status: 'upcoming' }
  ];

  return (
    <div className="p-6 rounded-3xl border border-[#E7E5E4] bg-white space-y-6 shadow-sm">
      
      {/* Top Header & Streak Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E5E4]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FFF3E8] border border-[#F97316]/20 flex items-center justify-center text-[#F97316]">
            <Flame className="w-5 h-5 fill-[#F97316]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#1C1917]">Career Momentum</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF3E8] text-[#F97316] border border-[#F97316]/20">
                🔥 5 Day Streak
              </span>
            </div>
            <p className="text-xs text-[#78716C] mt-0.5">
              +3 skills verified this week • 2 milestones completed
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-[#FAFAFA] border border-[#E7E5E4] text-xs text-[#1C1917] flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#F97316]" />
            <span className="font-semibold text-[#16A34A]">+120 Career XP</span>
          </div>
        </div>
      </div>

      {/* Horizontal Career Phase Progression Timeline */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716C] block">
          Target Role Progression
        </span>
        
        <div className="relative flex items-center justify-between pt-2">
          {/* Background Connecting Line */}
          <div className="absolute left-4 right-4 top-5 h-0.5 bg-[#E7E5E4] -z-0" />
          
          {phases.map((phase, i) => {
            const isCompleted = phase.status === 'completed';
            const isActive = phase.status === 'active';

            return (
              <div key={i} className="flex flex-col items-center space-y-2 z-10">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-[#16A34A] text-white shadow-sm'
                      : isActive
                      ? 'border-2 border-[#F97316] text-[#F97316] bg-[#FFF3E8]'
                      : 'bg-white border border-[#E7E5E4] text-[#78716C]'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-[10px] font-semibold text-center max-w-[70px] ${
                  isActive ? 'text-[#F97316]' : isCompleted ? 'text-[#1C1917]' : 'text-[#78716C]'
                }`}>
                  {phase.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Streak Protection Prompt */}
      <div className="p-3.5 rounded-2xl bg-[#FFF3E8] border border-[#F97316]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#1C1917]">
          <Zap className="w-4 h-4 text-[#F97316] fill-[#F97316] shrink-0" />
          <span>Keep your momentum: Log today's learning task or review a roadmap step.</span>
        </div>

        <button
          onClick={() => setMarkedToday(true)}
          disabled={markedToday}
          className="px-3 py-1.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-50 text-white font-bold text-xs shrink-0 transition cursor-pointer shadow-sm"
        >
          {markedToday ? 'Streak Logged ✓' : 'Mark Today'}
        </button>
      </div>
    </div>
  );
};
