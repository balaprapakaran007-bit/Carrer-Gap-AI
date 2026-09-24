import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Layers, CheckCircle2 } from 'lucide-react';

export const CareerProgressChart: React.FC = () => {
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
    <div className="p-6 rounded-3xl border border-[#E7E5E4] bg-white space-y-6 shadow-sm">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-[#E7E5E4]">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#F97316]">
            Longitudinal Growth
          </span>
          <h3 className="text-base font-bold text-[#1C1917] mt-0.5">Job Readiness Progression</h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Time Range Selector */}
          <div className="flex items-center gap-1 bg-[#FAFAFA] p-1 rounded-xl border border-[#E7E5E4] text-[11px] font-bold">
            {(['7d', '30d', '90d'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  timeRange === t ? 'bg-[#F97316] text-white shadow-sm' : 'text-[#78716C] hover:text-[#1C1917]'
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
                ? 'bg-[#FFF3E8] border-[#F97316]/30 text-[#F97316]'
                : 'bg-white border-[#E7E5E4] text-[#78716C]'
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
            <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: '#78716C', fontSize: 11 }} />
            <YAxis domain={[40, 100]} tick={{ fill: '#78716C', fontSize: 11 }} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const pData = payload[0].payload;
                  return (
                    <div className="p-3 rounded-xl bg-white border border-[#E7E5E4] shadow-lg space-y-1 text-xs">
                      <p className="font-bold text-[#1C1917]">{label}</p>
                      <p className="font-bold text-[#F97316]">ML Engineer: {pData.readiness}%</p>
                      {showSecondaryRole && (
                        <p className="text-[#78716C] font-semibold">AI Platform: {pData.secondary}%</p>
                      )}
                      {pData.milestone && (
                        <p className="text-[#16A34A] text-[10px] pt-1 border-t border-[#E7E5E4] flex items-center gap-1">
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
              stroke="#F97316"
              strokeWidth={3}
              dot={{ fill: '#F97316', r: 4, strokeWidth: 2, stroke: '#FFFFFF' }}
              activeDot={{ r: 6 }}
            />

            {/* Secondary Role Overlay Line */}
            {showSecondaryRole && (
              <Line
                type="monotone"
                dataKey="secondary"
                stroke="#A8A29E"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ fill: '#A8A29E', r: 3 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Milestone Annotations */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E7E5E4] text-xs text-[#78716C]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 rounded-full bg-[#F97316]" />
            <span className="font-semibold text-[#1C1917]">ML Engineer (Active Target)</span>
          </div>
          {showSecondaryRole && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded-full bg-[#A8A29E]" />
              <span className="text-[#78716C]">AI Platform Engineer</span>
            </div>
          )}
        </div>

        <span className="text-[11px] text-[#78716C] flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
          <span>Milestone dots indicate verified completed roadmap steps</span>
        </span>
      </div>
    </div>
  );
};
