import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle,
  FileText, Mic, BarChart3, Layers, Zap, Target, Award,
  Cpu, ChevronRight, Play, Check, TrendingUp, HelpCircle
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { loginDemoUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'match' | 'gap' | 'roadmap'>('match');

  const handleDemoLaunch = () => {
    loginDemoUser();
    navigate('/analysis/demo-analysis-ml-01');
  };

  return (
    <div className="min-h-screen bg-[#07111F] text-[#F8FAFC] flex flex-col selection:bg-[#1677FF] selection:text-white relative overflow-hidden font-sans">
      
      {/* HavenMatch Atmospheric Radial Glows */}
      <div 
        className="absolute top-[-10%] left-[-5%] w-[550px] h-[550px] rounded-full pointer-events-none blur-[140px] opacity-25"
        style={{ background: 'radial-gradient(circle, #1677FF 0%, transparent 70%)' }}
      />
      <div 
        className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none blur-[160px] opacity-20"
        style={{ background: 'radial-gradient(circle, #06D6FF 0%, transparent 70%)' }}
      />
      <div 
        className="absolute top-[60%] left-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none blur-[150px] opacity-15"
        style={{ background: 'radial-gradient(circle, #14B8A6 0%, transparent 70%)' }}
      />

      {/* Subtle Background AI Network Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06] overflow-hidden">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="network-grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1.5" fill="#06D6FF" />
              <circle cx="70" cy="70" r="1.5" fill="#1677FF" />
              <path d="M 10 10 L 70 70 M 70 10 L 10 70" stroke="#1E334D" strokeWidth="0.75" strokeDasharray="3 3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#network-grid)" />
        </svg>
      </div>

      {/* ============================================================
          HERO SECTION
          ============================================================ */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center space-y-8 z-10">
        
        {/* Brand Engine Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0B1728]/90 border border-[#1E334D] text-xs font-semibold shadow-lg shadow-[#07111F]/50 backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-[#06D6FF] animate-pulse" />
          <span className="text-[#06D6FF] font-mono tracking-wide">CAREERGAP AI</span>
          <span className="text-[#1E334D]">|</span>
          <span className="text-[#CBD5E1]">Next-Gen Career Intelligence Engine</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1] max-w-5xl mx-auto uppercase">
          TURN YOUR{' '}
          <span className="bg-gradient-to-r from-[#06D6FF] via-[#1677FF] to-[#06D6FF] bg-clip-text text-transparent">
            SKILL GAPS
          </span>{' '}
          INTO YOUR NEXT OPPORTUNITY.
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-[#CBD5E1] max-w-3xl mx-auto leading-relaxed font-normal">
          Understand exactly what stands between you and your target role — then get an AI-generated plan to close the gap.
          <span className="block mt-1 text-[#94A3B8] text-sm">
            "Don't just know your match. Know your next move."
          </span>
        </p>

        {/* Action CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to="/analyze"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#1677FF] to-[#06D6FF] hover:opacity-95 text-[#07111F] text-sm font-extrabold shadow-xl shadow-[#1677FF]/25 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Sparkles className="w-4 h-4 fill-[#07111F]" />
            <span>ANALYZE MY RESUME →</span>
          </Link>

          <button
            onClick={handleDemoLaunch}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#0B1728] hover:bg-[#0F1D30] text-[#F8FAFC] border border-[#1E334D] hover:border-[#06D6FF]/50 text-sm font-bold flex items-center justify-center gap-2.5 transition shadow-lg"
          >
            <Play className="w-4 h-4 text-[#06D6FF] fill-[#06D6FF]/20" />
            <span>Try Live Demo Analysis</span>
          </button>
        </div>

        {/* ============================================================
            PRODUCT VISUALIZATION (HAVENMATCH-INSPIRED MINIATURE UI)
            ============================================================ */}
        <div className="pt-10 relative">
          
          {/* Floating Insight Card 1 (Top Left) */}
          <div className="hidden lg:flex absolute -top-2 -left-8 z-20 items-center gap-3 p-3.5 rounded-2xl bg-[#0B1728]/95 border border-[#EF4444]/40 shadow-2xl backdrop-blur-md animate-bounce" style={{ animationDuration: '6s' }}>
            <div className="w-8 h-8 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 flex items-center justify-center text-[#EF4444]">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">AI GAP DETECTED</div>
              <div className="text-xs font-black text-white flex items-center gap-1.5">
                Docker <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#EF4444]/20 text-[#EF4444] font-bold">HIGH PRIORITY</span>
              </div>
            </div>
          </div>

          {/* Floating Insight Card 2 (Bottom Left) */}
          <div className="hidden lg:flex absolute bottom-8 -left-10 z-20 items-center gap-3 p-3.5 rounded-2xl bg-[#0B1728]/95 border border-[#14B8A6]/40 shadow-2xl backdrop-blur-md animate-bounce" style={{ animationDuration: '7s' }}>
            <div className="w-8 h-8 rounded-xl bg-[#14B8A6]/15 border border-[#14B8A6]/30 flex items-center justify-center text-[#14B8A6]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">ROADMAP STATUS</div>
              <div className="text-xs font-black text-[#14B8A6]">2 / 6 MILESTONES DONE</div>
            </div>
          </div>

          {/* Floating Insight Card 3 (Top Right) */}
          <div className="hidden lg:flex absolute -top-4 -right-8 z-20 items-center gap-3 p-3.5 rounded-2xl bg-[#0B1728]/95 border border-[#06D6FF]/40 shadow-2xl backdrop-blur-md animate-bounce" style={{ animationDuration: '8s' }}>
            <div className="w-8 h-8 rounded-xl bg-[#06D6FF]/15 border border-[#06D6FF]/30 flex items-center justify-center text-[#06D6FF]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">JOB READINESS</div>
              <div className="text-xs font-black text-white">78% <span className="text-[#14B8A6] font-bold">+14% this month</span></div>
            </div>
          </div>

          {/* Main Floating Interface Panel */}
          <div className="rounded-3xl border border-[#1E334D] bg-[#0B1728]/95 backdrop-blur-xl shadow-2xl shadow-[#07111F]/80 p-6 sm:p-8 max-w-4xl mx-auto text-left relative overflow-hidden">
            
            {/* Window Bar Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#1E334D]">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#1677FF] to-[#06D6FF] p-0.5 flex items-center justify-center shadow-md">
                  <div className="w-full h-full bg-[#0B1728] rounded-[14px] flex items-center justify-center font-mono font-black text-[#06D6FF] text-xs">
                    AI
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-base">Senior AI Engineer Analysis</h3>
                    <span className="px-2 py-0.5 rounded-full bg-[#14B8A6]/15 border border-[#14B8A6]/30 text-[#14B8A6] text-[10px] font-extrabold uppercase">
                      Target Match
                    </span>
                  </div>
                  <p className="text-xs text-[#94A3B8]">Anthropic • Applied ML & Inference Systems</p>
                </div>
              </div>

              {/* Readiness Score Widget */}
              <div className="flex items-center gap-4 bg-[#0F1D30] border border-[#1E334D] px-4 py-2.5 rounded-2xl">
                <div className="text-right">
                  <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">AI CAREER READINESS</div>
                  <div className="text-xs font-semibold text-[#14B8A6] flex items-center justify-end gap-1">
                    <TrendingUp className="w-3 h-3" /> +14% this month
                  </div>
                </div>
                <div className="text-3xl font-black text-[#06D6FF] font-mono leading-none">
                  78%
                </div>
              </div>
            </div>

            {/* Interactive Tab Switcher */}
            <div className="flex items-center gap-2 my-5 border-b border-[#1E334D] pb-3 text-xs">
              <button
                onClick={() => setActiveTab('match')}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'match'
                    ? 'bg-[#1677FF] text-white'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0F1D30]'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Skill Alignment</span>
              </button>
              <button
                onClick={() => setActiveTab('gap')}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'gap'
                    ? 'bg-[#1677FF] text-white'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0F1D30]'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5 text-[#EF4444]" />
                <span>Gap Diagnostics</span>
              </button>
              <button
                onClick={() => setActiveTab('roadmap')}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'roadmap'
                    ? 'bg-[#1677FF] text-white'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0F1D30]'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-[#06D6FF]" />
                <span>Next Best Action</span>
              </button>
            </div>

            {/* Tab 1: Skill Alignment Bars */}
            {activeTab === 'match' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-[#F8FAFC] flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-[#14B8A6]" /> Python & PyTorch
                        </span>
                        <span className="text-[#06D6FF] font-mono font-bold">90%</span>
                      </div>
                      <div className="w-full bg-[#07111F] rounded-full h-2 overflow-hidden border border-[#1E334D]">
                        <div className="bg-gradient-to-r from-[#1677FF] to-[#06D6FF] h-full rounded-full" style={{ width: '90%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-[#F8FAFC] flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-[#14B8A6]" /> RAG & Vector Databases
                        </span>
                        <span className="text-[#06D6FF] font-mono font-bold">86%</span>
                      </div>
                      <div className="w-full bg-[#07111F] rounded-full h-2 overflow-hidden border border-[#1E334D]">
                        <div className="bg-gradient-to-r from-[#1677FF] to-[#06D6FF] h-full rounded-full" style={{ width: '86%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-[#F8FAFC] flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-[#14B8A6]" /> SQL & Data Engineering
                        </span>
                        <span className="text-[#06D6FF] font-mono font-bold">82%</span>
                      </div>
                      <div className="w-full bg-[#07111F] rounded-full h-2 overflow-hidden border border-[#1E334D]">
                        <div className="bg-gradient-to-r from-[#1677FF] to-[#06D6FF] h-full rounded-full" style={{ width: '82%' }} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-[#F8FAFC] flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-[#EF4444]" /> Docker & Containerization
                        </span>
                        <span className="text-[#EF4444] font-mono font-bold">20%</span>
                      </div>
                      <div className="w-full bg-[#07111F] rounded-full h-2 overflow-hidden border border-[#1E334D]">
                        <div className="bg-[#EF4444] h-full rounded-full" style={{ width: '20%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-[#F8FAFC] flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-[#F59E0B]" /> AWS Cloud Deployments
                        </span>
                        <span className="text-[#F59E0B] font-mono font-bold">25%</span>
                      </div>
                      <div className="w-full bg-[#07111F] rounded-full h-2 overflow-hidden border border-[#1E334D]">
                        <div className="bg-[#F59E0B] h-full rounded-full" style={{ width: '25%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-[#F8FAFC] flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-[#14B8A6]" /> LLM Fine-Tuning (LoRA)
                        </span>
                        <span className="text-[#06D6FF] font-mono font-bold">75%</span>
                      </div>
                      <div className="w-full bg-[#07111F] rounded-full h-2 overflow-hidden border border-[#1E334D]">
                        <div className="bg-gradient-to-r from-[#1677FF] to-[#06D6FF] h-full rounded-full" style={{ width: '75%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Gap Diagnostics */}
            {activeTab === 'gap' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-[#07111F] border border-[#14B8A6]/30 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Python / ML Ops</span>
                    <span className="text-[#14B8A6] font-bold text-[11px] px-2 py-0.5 rounded bg-[#14B8A6]/10">STRONG MATCH</span>
                  </div>
                  <p className="text-[11px] text-[#CBD5E1]">"Deployed Transformer models processing 50k req/sec..."</p>
                  <span className="text-[10px] text-[#94A3B8] block">Validated with project repository link</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#07111F] border border-[#EF4444]/30 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Docker / K8s</span>
                    <span className="text-[#EF4444] font-bold text-[11px] px-2 py-0.5 rounded bg-[#EF4444]/10">CRITICAL GAP</span>
                  </div>
                  <p className="text-[11px] text-[#CBD5E1]">Required in job specification but missing in experience.</p>
                  <span className="text-[10px] text-[#06D6FF] font-semibold block">→ AI Project Blueprint Ready</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#07111F] border border-[#F59E0B]/30 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">AWS Production</span>
                    <span className="text-[#F59E0B] font-bold text-[11px] px-2 py-0.5 rounded bg-[#F59E0B]/10">WEAK EVIDENCE</span>
                  </div>
                  <p className="text-[11px] text-[#CBD5E1]">Listed as skill keyword but lacking metrics or architecture.</p>
                  <span className="text-[10px] text-[#F59E0B] font-semibold block">→ Needs quantitative scale proof</span>
                </div>
              </div>
            )}

            {/* Tab 3: Next Best Action Banner */}
            <div className="mt-5 p-4 rounded-2xl bg-[#0F1D30] border border-[#06D6FF]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#06D6FF]/15 border border-[#06D6FF]/30 flex items-center justify-center text-[#06D6FF]">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#06D6FF] uppercase tracking-wider">NEXT BEST ACTION</div>
                  <div className="text-sm font-bold text-white">Complete Docker & Multi-Stage Build Fundamentals</div>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <span className="text-xs font-mono font-bold text-[#14B8A6] px-2.5 py-1 rounded-lg bg-[#14B8A6]/10 border border-[#14B8A6]/30">
                  +8 readiness points
                </span>
                <button
                  onClick={handleDemoLaunch}
                  className="px-4 py-2 rounded-xl bg-[#1677FF] hover:bg-[#2563EB] text-white text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <span>Start Action</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* ============================================================
          CAREER INTELLIGENCE LOOP / JOURNEY PIPELINE
          ============================================================ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-[#1E334D] z-10">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#06D6FF]">The Intelligence Loop</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            FROM UNCERTAINTY TO JOB-READY IN 5 STAGES
          </h2>
          <p className="text-sm text-[#94A3B8] max-w-xl mx-auto">
            A continuous loop that diagnoses gaps, designs proof-of-work projects, and coaches your interview responses.
          </p>
        </div>

        {/* 5-Step Connected Network Nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
          {[
            { step: '01', title: 'RESUME INGESTION', desc: 'Parses PDF & models deep competency graph' },
            { step: '02', title: 'TARGET JOB FIT', desc: 'Analyzes JD requirements & implicit expectations' },
            { step: '03', title: 'GAP DETECTION', desc: 'Identifies missing skills & weak evidence claims' },
            { step: '04', title: 'PORTFOLIO ROADMAP', desc: 'Generates step-by-step verifiable project plans' },
            { step: '05', title: 'INTERVIEW READINESS', desc: 'Simulates gap-probing interview rounds' },
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="p-5 rounded-2xl bg-[#0B1728] border border-[#1E334D] hover:border-[#06D6FF]/50 transition-all group relative space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-black text-[#06D6FF] group-hover:text-[#F8FAFC] transition">
                  {item.step}
                </span>
                <div className="w-2 h-2 rounded-full bg-[#1677FF] group-hover:bg-[#06D6FF] group-hover:scale-150 transition" />
              </div>
              <h4 className="text-xs font-bold text-white tracking-wide">{item.title}</h4>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          DIFFERENTIATION MATRIX: LEGACY ATS VS CAREERGAP AI
          ============================================================ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-[#1E334D] z-10 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#06D6FF]">Why CareerGap AI</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            BEYOND BRITTLE ATS KEYWORD SCORING
          </h2>
          <p className="text-sm text-[#94A3B8] max-w-xl mx-auto">
            Traditional resume checkers only count keywords. CareerGap AI understands engineering depth.
          </p>
        </div>

        <div className="rounded-3xl border border-[#1E334D] bg-[#0B1728] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#1E334D] bg-[#07111F] text-[11px] uppercase tracking-wider text-[#94A3B8]">
                  <th className="py-4 px-6 font-mono">Capability</th>
                  <th className="py-4 px-6 text-[#94A3B8]">Legacy ATS Resume Checkers</th>
                  <th className="py-4 px-6 text-[#06D6FF] font-bold">CareerGap AI Intelligence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E334D]/60 text-xs">
                <tr>
                  <td className="py-4 px-6 font-bold text-white">Skill Understanding</td>
                  <td className="py-4 px-6 text-[#94A3B8]">Exact string matching (misses synonyms & context)</td>
                  <td className="py-4 px-6 text-[#14B8A6] font-semibold">Semantic vector taxonomy + Implicit requirement mapping</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-bold text-white">Evidence Evaluation</td>
                  <td className="py-4 px-6 text-[#94A3B8]">Treats buzzwords in a list the same as production scale</td>
                  <td className="py-4 px-6 text-[#14B8A6] font-semibold">Distinguishes Strong, Moderate, and Weak buzzwords with citations</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-bold text-white">Closing Skill Gaps</td>
                  <td className="py-4 px-6 text-[#94A3B8]">Tells you to stuff missing keywords into your text</td>
                  <td className="py-4 px-6 text-[#14B8A6] font-semibold">Designs multi-skill portfolio projects & curated learning steps</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-bold text-white">Interview Readiness</td>
                  <td className="py-4 px-6 text-[#94A3B8]">None (leaves you unprepared for technical screens)</td>
                  <td className="py-4 px-6 text-[#14B8A6] font-semibold">Voice & text mock interview simulator with rubric evaluation</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-bold text-white">Peer Benchmarks</td>
                  <td className="py-4 px-6 text-[#94A3B8]">Arbitrary black-box percentage score</td>
                  <td className="py-4 px-6 text-[#14B8A6] font-semibold">Competency-by-competency radar percentiles against real candidates</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ============================================================
          6 CORE CAPABILITY PILLARS
          ============================================================ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-[#1E334D] z-10 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#06D6FF]">Full Engine Suite</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            EVERYTHING YOU NEED TO LAND YOUR TARGET ROLE
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#0B1728] border border-[#1E334D] hover:border-[#1677FF]/60 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1677FF]/15 border border-[#1677FF]/30 flex items-center justify-center text-[#1677FF]">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm">Explainable Match Breakdown</h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Every match score is accompanied by granular evidence sentences, taxonomy mappings, and confidence ratings.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0B1728] border border-[#1E334D] hover:border-[#06D6FF]/60 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#06D6FF]/15 border border-[#06D6FF]/30 flex items-center justify-center text-[#06D6FF]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm">Evidence Depth Analysis</h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Identifies weak resume claims without metrics or outcomes, giving you instant rewriting suggestions.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0B1728] border border-[#1E334D] hover:border-[#14B8A6]/60 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#14B8A6]/15 border border-[#14B8A6]/30 flex items-center justify-center text-[#14B8A6]">
              <Target className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm">Project Blueprint Architecture</h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Generates GitHub-ready project scopes, tech stack choices, and architecture diagrams to solve multiple gaps simultaneously.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0B1728] border border-[#1E334D] hover:border-[#1677FF]/60 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1677FF]/15 border border-[#1677FF]/30 flex items-center justify-center text-[#1677FF]">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm">Actionable Roadmap Engine</h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Organizes skills into high-priority weekly sprints with direct links to verified courses, docs, and certifications.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0B1728] border border-[#1E334D] hover:border-[#06D6FF]/60 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#06D6FF]/15 border border-[#06D6FF]/30 flex items-center justify-center text-[#06D6FF]">
              <Mic className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm">Voice Mock Interview Simulator</h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Simulates realistic interview rounds targeting your weak areas with instant audio feedback and rubric scores.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0B1728] border border-[#1E334D] hover:border-[#14B8A6]/60 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#14B8A6]/15 border border-[#14B8A6]/30 flex items-center justify-center text-[#14B8A6]">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm">Peer Benchmarks & Comparison</h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Compare your readiness percentile against target roles and benchmark multiple job offers side-by-side.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          BOTTOM CTA SECTION
          ============================================================ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-[#1E334D] text-center space-y-6 z-10">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-b from-[#0B1728] to-[#07111F] border border-[#1E334D] shadow-2xl relative overflow-hidden space-y-6">
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #06D6FF 0%, #1677FF 60%, transparent 80%)' }}
          />
          
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            READY TO CLOSE YOUR CAREER GAP?
          </h2>
          <p className="text-sm sm:text-base text-[#CBD5E1] max-w-xl mx-auto">
            Upload your resume and target job description now to receive your personalized roadmap and gap diagnostics.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/analyze"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#1677FF] to-[#06D6FF] hover:opacity-95 text-[#07111F] text-sm font-extrabold shadow-xl shadow-[#1677FF]/30 flex items-center justify-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4 fill-[#07111F]" />
              <span>START FREE ANALYSIS →</span>
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#0F1D30] hover:bg-[#13243A] text-white border border-[#1E334D] text-sm font-bold flex items-center justify-center gap-2 transition"
            >
              <span>Create Account</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
          FOOTER
          ============================================================ */}
      <footer className="mt-auto py-8 border-t border-[#1E334D] bg-[#07111F] text-center text-xs text-[#94A3B8] z-10 space-y-2">
        <div className="flex items-center justify-center gap-6 font-medium text-xs text-[#CBD5E1]">
          <Link to="/analyze" className="hover:text-[#06D6FF] transition">Analyze</Link>
          <Link to="/benchmarks" className="hover:text-[#06D6FF] transition">Benchmarks</Link>
          <Link to="/multi-compare" className="hover:text-[#06D6FF] transition">Compare Jobs</Link>
          <Link to="/login" className="hover:text-[#06D6FF] transition">Sign In</Link>
          <Link to="/register" className="hover:text-[#06D6FF] transition">Get Started</Link>
        </div>
        <p>© 2026 CareerGap AI — Built for PS-93 AI Career Fit & Skill-Gap Engine • HavenMatch Visual System</p>
      </footer>

    </div>
  );
};
