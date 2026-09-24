import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceDot } from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { TrendingUp, Layers, CheckCircle2 } from 'lucide-react';

export const CareerProgressChart: React.FC = () => {
  const { activeHex } = useTheme();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [showSecondaryRole, setShowSecondaryRole] = useState(true);

  const data30d = [
    { date: 'Sep 01', readiness: 60, secondary: 52, milestone: 'Resume Uploaded' },
    { date: 'Sep 06', readiness: 64, secondary: 56 },
    { date: 'Sep 12', readiness: 68, secondary: 60, milestone: 'PyTorch Verified' },
    { date: 'Sep 18', readiness: 72, secondary: 65, milestone: 'SQL Pipeline Scaled' },
    { date: 'Sep 24', readiness: 78, secondary: 70, milestone: 'RAG Search Built' },
  ];

  const data7d = [
    { date: 'Sep 18', readiness: 72, secondary: 65 },
    { date: 'Sep 20', readiness: 74, secondary: 67 },
    { date: 'Sep 22', readiness: 76, secondary: 69 },
    { date: 'Sep 24', readiness: 78, secondary: 70, milestone: 'RAG Search Built' },
  ];

  const data90d = [
    { date: 'Jul 01', readiness: 48, secondary: 42 },
    { date: 'Aug 01', readiness: 58, secondary: 50 },
    { date: 'Sep 01', readiness: 60, secondary: 52 },
    { date: 'Sep 24', readiness: 78, secondary: 70, milestone: 'RAG Search Built' },
  ];

  const chartData = timeRange === '7d' ? data7d : timeRange === '90d' ? data90d : data30d;

  return (
    <div className="p-6 rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md space-y-6 shadow-xl">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-800/60">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
            Longitudinal Growth
          </span>
          <h3 className="text-base font-bold text-white mt-0.5">Job Readiness Progression</h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Time Range Selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-bold">
            {(['7d', '30d', '90d'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  timeRange === t ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Secondary Role Toggle */}
          <button
            onClick={() => setShowSecondaryRole(!showSecondaryRole)}
            className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              showSecondaryRole
                ? 'bg-purple-500/15 border-purple-500/30 text-purple-300'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>AI Platform Role Overlay</span>
          </button>
        </div>
      </div>

      {/* Main Line Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 15, right: 25, left: -15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis domain={[40, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const pData = payload[0].payload;
                  return (
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 shadow-xl space-y-1 text-xs">
                      <p className="font-bold text-slate-200">{label}</p>
                      <p className="font-bold text-blue-400">ML Engineer: {pData.readiness}%</p>
                      {showSecondaryRole && (
                        <p className="text-purple-400 font-semibold">AI Platform: {pData.secondary}%</p>
                      )}
                      {pData.milestone && (
                        <p className="text-emerald-400 text-[10px] pt-1 border-t border-slate-800 flex items-center gap-1">
                          <span>★ {pData.milestone}</span>
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            
            {/* Primary Role Line */}
            <Line
              type="monotone"
              dataKey="readiness"
              stroke={activeHex}
              strokeWidth={3}
              dot={{ fill: activeHex, r: 4, strokeWidth: 2, stroke: '#0f172a' }}
              activeDot={{ r: 7 }}
            />

            {/* Secondary Role Overlay Line */}
            {showSecondaryRole && (
              <Line
                type="monotone"
                dataKey="secondary"
                stroke="#a855f7"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ fill: '#a855f7', r: 3 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Milestone Annotations */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/60 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 rounded-full" style={{ backgroundColor: activeHex }} />
            <span className="font-semibold text-slate-200">ML Engineer (Active Target)</span>
          </div>
          {showSecondaryRole && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded-full bg-purple-500" />
              <span>AI Platform Engineer</span>
            </div>
          )}
        </div>

        <span className="text-[11px] text-slate-500 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Milestone dots indicate verified completed roadmap steps</span>
        </span>
      </div>
    </div>
  );
};
