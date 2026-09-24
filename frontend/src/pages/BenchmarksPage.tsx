import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { BenchmarkRoleResponse } from '../types';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

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
        console.error('Error fetching benchmarks:', err);
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
        yourProficiency: benchmark.aheadSkills.includes(skill) ? 90 : 30
      }))
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* 1. HEADER (Section 37) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span 
              className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border"
              style={{
                backgroundColor: 'var(--primary-soft)',
                borderColor: 'var(--primary)',
                color: 'var(--primary)'
              }}
            >
              Peer Benchmarks
            </span>
            <span className="text-[11px] font-semibold text-[var(--warning)] bg-[var(--warning-soft)] px-2 py-0.5 rounded-full border border-[var(--warning)]/20">
              Anonymized Cohort Data
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)] mt-1">
            How do you compare?
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5">
            Compare your readiness score and competency depth against verified candidate percentiles for target roles.
          </p>
        </div>

        {/* Role Selector Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          {roles.map((r) => (
            <button
              key={r.key}
              onClick={() => setSelectedRole(r.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedRole === r.key
                  ? 'text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
              style={selectedRole === r.key ? { backgroundColor: 'var(--primary)' } : {}}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {loading || !benchmark ? (
        <div className="p-16 text-center space-y-2 font-mono text-xs text-[var(--text-muted)]">
          Loading benchmark analytics...
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* 2. TOP COMPARISON CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Overall Score Comparison */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Cohort Readiness Median
              </span>
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-black" style={{ color: 'var(--primary)' }}>
                    {benchmark.candidateScore}%
                  </span>
                  <span className="block text-[11px] text-[var(--text-muted)] font-medium">Your Profile</span>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-[var(--text-muted)]">
                    {benchmark.avgReadiness}%
                  </span>
                  <span className="block text-[11px] text-[var(--text-muted)] font-medium">Peer Median</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--success)] font-semibold">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>+12.6% Above Benchmark</span>
                </span>
                <span className="text-[10px] text-[var(--text-muted)] font-mono">Top 22%</span>
              </div>
            </div>

            {/* Ahead Competencies */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Your Strong Competencies
                </span>
                <span className="text-xs font-bold text-[var(--success)]">Ahead of 78% of peers</span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {benchmark.aheadSkills.map((s, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-[var(--success-soft)] text-[var(--success)] border border-[var(--success)]/20"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{s}</span>
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-[var(--text-muted)] pt-1">
                You exhibit deeper verified project proof in these areas than the cohort median.
              </p>
            </div>

            {/* Biggest Gap / Opportunity */}
            <div className="rounded-2xl border border-[var(--danger)]/30 bg-[var(--surface)] p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--danger)]">
                  Primary Gap / Opportunity
                </span>
                <span className="text-xs font-bold text-[var(--danger)]">Behind cohort</span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {benchmark.behindSkills.map((s, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-[var(--danger-soft)] text-[var(--danger)] border border-[var(--danger)]/20"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{s}</span>
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-[var(--text-muted)] pt-1">
                68% of candidates in this role hold verified Docker and Cloud pipeline credentials.
              </p>
            </div>
          </div>

          {/* 3. VISUALIZATION BARS: YOU VS BENCHMARK (Section 38) */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-[var(--border)]">
              <div>
                <h3 className="text-sm font-bold text-[var(--text)]">
                  Competency Distribution: You vs. Peer Cohort
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Your proficiency (in your signature brand theme) compared to the cohort baseline.
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md" style={{ backgroundColor: 'var(--primary)' }} />
                  <span className="text-[var(--text)]">Your Verified Level</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-[var(--text-muted)] opacity-40" />
                  <span className="text-[var(--text-muted)]">Cohort Median</span>
                </div>
              </div>
            </div>

            {/* Custom Horizontal Bar Comparison */}
            <div className="space-y-4">
              {chartData.map((item, idx) => {
                const delta = item.yourProficiency - item.peerAverage;
                const isAhead = delta >= 0;

                return (
                  <div key={idx} className="space-y-1.5 p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[var(--text)]">{item.skill}</span>
                      <div className="flex items-center gap-2">
                        <span 
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isAhead 
                              ? 'bg-[var(--success-soft)] text-[var(--success)]' 
                              : 'bg-[var(--danger-soft)] text-[var(--danger)]'
                          }`}
                        >
                          {isAhead ? `+${delta}% Ahead` : `${delta}% Gap`}
                        </span>
                        <span className="text-xs font-mono text-[var(--text-muted)]">
                          You: <strong className="text-[var(--text)]">{item.yourProficiency}%</strong> | Cohort: {item.peerAverage}%
                        </span>
                      </div>
                    </div>

                    {/* Dual Comparative Bars */}
                    <div className="space-y-1 pt-1">
                      {/* Your Bar */}
                      <div className="h-2 w-full rounded-full bg-[var(--surface)] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${item.yourProficiency}%`,
                            backgroundColor: 'var(--primary)'
                          }}
                        />
                      </div>

                      {/* Benchmark Bar */}
                      <div className="h-1.5 w-full rounded-full bg-[var(--surface)] overflow-hidden opacity-60">
                        <div
                          className="h-full rounded-full bg-[var(--text-muted)]"
                          style={{ width: `${item.peerAverage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. BIGGEST OPPORTUNITY CALLOUT CARD (Section 37) */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-[var(--text)]">
                  Your Biggest Opportunity: Docker & Container Deployment
                </h3>
              </div>
              <p className="text-xs text-[var(--text-muted)] max-w-2xl">
                Closing the Docker containerization gap will move your overall readiness into the <strong>top 10%</strong> of candidate profiles for {selectedRole.replace(/_/g, ' ').toUpperCase()}.
              </p>
            </div>

            <Link
              to="/roadmaps/demo-analysis-ml-01"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-sm transition hover:opacity-90 shrink-0"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              <span>Execute Roadmap Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
