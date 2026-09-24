import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Award, CheckCircle2, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const CareerMomentumCard: React.FC = () => {
  const { activeHex } = useTheme();
  const [markedToday, setMarkedToday] = useState(false);

  const phases = [
    { label: 'Profile Base', status: 'completed' },
    { label: 'Core Skills', status: 'completed' },
    { label: 'Portfolio Projects', status: 'active' },
    { label: 'Interview Ready', status: 'upcoming' },
    { label: 'Job Ready', status: 'upcoming' }
  ];

  return (
    <div className="p-6 rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md space-y-6 shadow-xl">
      
      {/* Top Header & Streak Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Flame className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Career Momentum</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300">
                🔥 5 Day Streak
              </span>
            </div>
            <p className="text-xs text-slate-400">
              +3 skills verified this week • 2 milestones completed
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-blue-400" />
            <span>+120 Career XP</span>
          </div>
        </div>
      </div>

      {/* Horizontal Career Phase Progression Timeline */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
          Target Role Progression
        </span>
        
        <div className="relative flex items-center justify-between pt-2">
          {/* Background Connecting Line */}
          <div className="absolute left-4 right-4 top-5 h-0.5 bg-slate-800 -z-0" />
          
          {phases.map((phase, i) => {
            const isCompleted = phase.status === 'completed';
            const isActive = phase.status === 'active';

            return (
              <div key={i} className="flex flex-col items-center space-y-2 z-10">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                      : isActive
                      ? 'border-2 text-white bg-slate-950'
                      : 'bg-slate-900 border border-slate-700 text-slate-500'
                  }`}
                  style={isActive ? { borderColor: activeHex, color: activeHex } : {}}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-[10px] font-semibold text-center max-w-[70px] ${
                  isActive ? 'text-white' : isCompleted ? 'text-slate-300' : 'text-slate-500'
                }`}>
                  {phase.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Streak Protection Prompt */}
      <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-amber-300">
          <Zap className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Keep your momentum: Log today's learning task or review a roadmap step.</span>
        </div>

        <button
          onClick={() => setMarkedToday(true)}
          disabled={markedToday}
          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs shrink-0 transition"
        >
          {markedToday ? 'Streak Logged ✓' : 'Mark Today'}
        </button>
      </div>
    </div>
  );
};
