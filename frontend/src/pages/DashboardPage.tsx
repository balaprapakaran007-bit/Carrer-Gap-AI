import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { FullAnalysisResult, StreakInfo } from '../types';
import {
  Sparkles, Flame, Award, ArrowRight, CheckCircle2, AlertTriangle,
  XCircle, MapPin, Mic, Layers, BarChart3, Clock, TrendingUp
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState<FullAnalysisResult[]>([]);
  const [streak, setStreak] = useState<StreakInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [anList, skillData] = await Promise.all([
          api.listAnalyses(),
          api.getSkillProgress()
        ]);
        setAnalyses(anList);
        setStreak(skillData.streak);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const chartData = [
    { subject: 'Python', candidate: 95, target: 90 },
    { subject: 'PyTorch', candidate: 85, target: 85 },
    { subject: 'SQL', candidate: 90, target: 80 },
    { subject: 'Docker', candidate: 30, target: 85 },
    { subject: 'FastAPI', candidate: 40, target: 80 },
    { subject: 'AWS', candidate: 35, target: 75 },
    { subject: 'RAG', candidate: 80, target: 80 },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 selection:bg-blue-500 selection:text-white">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">Candidate Workspace</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
            Welcome back, {user?.name || 'Alex'}
          </h1>
          <p className="text-xs text-slate-400">
            Track your job readiness, close skill gaps, and practice interview questions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/analyze"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>New Job Analysis</span>
          </Link>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Target Roles Analyzed</span>
          <div className="text-2xl font-black text-white">{analyses.length || 1}</div>
          <p className="text-[11px] text-slate-500">Across 2 target companies</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Average Readiness</span>
          <div className="text-2xl font-black text-blue-400">78%</div>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+14% from initial profile</span>
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Verified Strengths</span>
          <div className="text-2xl font-black text-emerald-400">12</div>
          <p className="text-[11px] text-slate-500">Python, SQL, PyTorch, RAG</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">High Priority Gaps</span>
          <div className="text-2xl font-black text-rose-400">4</div>
          <p className="text-[11px] text-slate-500">Docker, FastAPI, AWS</p>
        </div>
      </div>

      {/* Momentum & Gamification Streak Widget */}
      <div className="p-6 rounded-3xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-slate-900/80 to-slate-900/80 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Flame className="w-6 h-6 fill-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white">5-Day Learning Streak Active!</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300">🔥 On Fire</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              You completed 2 roadmap milestones this week. Next milestone: <strong className="text-amber-300">"Docker Ready"</strong> badge (1 step remaining).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200">
            <Award className="w-4 h-4 text-blue-400" />
            <span>2 Badges Earned</span>
          </div>
          <Link
            to="/roadmaps/demo-analysis-ml-01"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5"
          >
            <span>Continue Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Grid: Recent Analyses & Skill Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Recent Analyses */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100">Target Role Analyses</h3>
            <Link to="/analyze" className="text-xs text-blue-400 hover:text-blue-300 transition">
              + Add Target Job
            </Link>
          </div>

          <div className="space-y-3">
            {analyses.length === 0 ? (
              <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/30 text-center text-xs text-slate-400">
                No analyses created yet. Click "New Job Analysis" to start!
              </div>
            ) : (
              analyses.map((an) => (
                <Link
                  key={an.id}
                  to={`/analysis/${an.id}`}
                  className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40 hover:border-blue-500/40 hover:bg-slate-900/70 transition block space-y-3 group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-base group-hover:text-blue-400 transition">
                          {an.jobTitle}
                        </h4>
                        <span className="text-xs text-slate-400">• {an.jobCompany}</span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-1">
                        {an.summaryParagraph}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-2xl font-black text-blue-400">{an.readinessScore}%</span>
                      <span className="block text-[10px] text-slate-500 uppercase font-semibold">Match</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60 text-xs">
                    <span className="inline-flex items-center gap-1 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {an.matchedCount} Matched
                    </span>
                    <span className="inline-flex items-center gap-1 text-rose-400">
                      <XCircle className="w-3.5 h-3.5" />
                      {an.missingCount} Missing
                    </span>
                    <span className="inline-flex items-center gap-1 text-amber-400">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {an.weakEvidenceCount} Weak Evidence
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Right Col: Competency Chart */}
        <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Competency Alignment
            </h3>
            <span className="text-[10px] text-blue-400 font-semibold">AI/ML Engineer</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#334155" tick={{ fill: '#64748b', fontSize: 9 }} />
                <Radar name="Candidate" dataKey="candidate" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                <Radar name="Target Job" dataKey="target" stroke="#a855f7" fill="#a855f7" fillOpacity={0.15} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800/60">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Your Profile</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span>Target Role Requirements</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
