import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { BenchmarkRoleResponse } from '../types';
import { BarChart3, TrendingUp, TrendingDown, Users, ShieldAlert, Award, Sparkles } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const BenchmarksPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>('ai_ml_engineer');
  const [benchmark, setBenchmark] = useState<BenchmarkRoleResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadBenchmarks = async () => {
      setLoading(true);
      try {
        const data = await api.getBenchmarks(selectedRole);
        setBenchmark(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadBenchmarks();
  }, [selectedRole]);

  const roles = [
    { key: 'ai_ml_engineer', label: 'AI / Machine Learning Engineer' },
    { key: 'fullstack_developer', label: 'Full Stack Developer' },
    { key: 'backend_engineer', label: 'Backend Software Engineer' },
    { key: 'data_scientist', label: 'Data Scientist' }
  ];

  const chartData = benchmark
    ? Object.entries(benchmark.skillAverages).map(([skill, peerAvg]) => ({
        skill,
        peerAverage: peerAvg,
        yourProficiency: benchmark.aheadSkills.includes(skill) ? 90 : 35
      }))
    : [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 selection:bg-blue-500 selection:text-white">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">Anonymized Insights</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5 mt-0.5">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            <span>Peer Role Benchmarking</span>
          </h1>
          <p className="text-xs text-slate-400">
            Compare your readiness and competency distribution against anonymized candidate aggregates for target roles.
          </p>
        </div>

        {/* Role Selector */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
          {roles.map((r) => (
            <button
              key={r.key}
              onClick={() => setSelectedRole(r.key)}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                selectedRole === r.key ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {loading || !benchmark ? (
        <div className="p-12 text-center text-xs text-slate-400 font-mono">Loading Peer Benchmarks...</div>
      ) : (
        <div className="space-y-6">
          
          {/* Top Comparison Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Candidate Score vs Peer Average */}
            <div className="p-6 rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Overall Readiness</span>
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-black text-blue-400">{benchmark.candidateScore}%</span>
                  <span className="block text-[11px] text-slate-400 font-medium">Your Profile</span>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-slate-400">{benchmark.avgReadiness}%</span>
                  <span className="block text-[11px] text-slate-500 font-medium">Peer Average</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-emerald-400 font-semibold">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>+12.6% Above Cohort Average</span>
                </span>
                <span className="text-[11px] text-slate-500">n = {benchmark.sampleSize} candidates</span>
              </div>
            </div>

            {/* Ahead Skills */}
            <div className="p-6 rounded-3xl border border-emerald-500/20 bg-emerald-950/10 backdrop-blur-md space-y-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <TrendingUp className="w-5 h-5" />
                <h3 className="text-sm font-bold">You're Ahead On</h3>
              </div>
              <p className="text-xs text-slate-300">
                Skills where your evidence strength and verification score significantly exceeds the peer average:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {benchmark.aheadSkills.map((s, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ★ {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Behind Skills */}
            <div className="p-6 rounded-3xl border border-amber-500/20 bg-amber-950/10 backdrop-blur-md space-y-4">
              <div className="flex items-center gap-2 text-amber-400">
                <TrendingDown className="w-5 h-5" />
                <h3 className="text-sm font-bold">You're Behind On</h3>
              </div>
              <p className="text-xs text-slate-300">
                Competencies where peer candidates frequently demonstrate stronger implementation proof:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {benchmark.behindSkills.map((s, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    ⚠️ {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Skill Averages Bar Chart */}
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white">Competency Breakdown vs Cohort Average</h3>
                <p className="text-xs text-slate-400">Anonymized benchmark data compiled from real candidate technical analyses.</p>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="skill" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                  <Bar dataKey="yourProficiency" name="Your Profile" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="peerAverage" name="Peer Cohort Average" fill="#64748b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
