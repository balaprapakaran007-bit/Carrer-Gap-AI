import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle,
  FileText, Mic, BarChart3, Layers, Zap, Target, Award,
  Cpu, ChevronRight, Play, Check, TrendingUp, HelpCircle, Compass, Flame
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
    <div className="min-h-screen bg-[#FFFFFF] text-[#1C1917] flex flex-col selection:bg-[#FFF3E8] selection:text-[#F97316] relative overflow-hidden font-sans">
      
      {/* Subtle Warm Atmospheric Glows */}
      <div 
        className="absolute top-[-10%] left-[-5%] w-[550px] h-[550px] rounded-full pointer-events-none blur-[140px] opacity-10"
        style={{ background: 'radial-gradient(circle, #F97316 0%, transparent 70%)' }}
      />
      <div 
        className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none blur-[160px] opacity-10"
        style={{ background: 'radial-gradient(circle, #EA580C 0%, transparent 70%)' }}
      />

      {/* Top Navbar */}
      <header className="w-full border-b border-[#E7E5E4] bg-[#FFFFFF]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[#F97316] flex items-center justify-center shadow-md shadow-[#F97316]/20 transition-transform group-hover:scale-105">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-[#1C1917]">
                CareerGap <span className="text-[#F97316]">AI</span>
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#1C1917] hover:bg-[#FAFAFA] border border-[#E7E5E4] transition"
            >
              Sign In
            </Link>
            <Link
              to="/analyze"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#F97316] hover:bg-[#EA580C] shadow-sm transition"
            >
              Analyze Resume →
            </Link>
          </div>
        </div>
      </header>

      {/* ============================================================
          HERO SECTION
          ============================================================ */}
      <section className="relative pt-16 pb-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center space-y-8 z-10">
        
        {/* Brand Engine Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#FAFAFA] border border-[#E7E5E4] text-xs font-semibold shadow-sm">
          <div className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
          <span className="text-[#F97316] font-mono tracking-wide font-bold">CAREERGAP AI</span>
          <span className="text-[#E7E5E4]">|</span>
          <span className="text-[#78716C]">Next-Gen Career Intelligence Engine</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#1C1917] leading-[1.1] max-w-5xl mx-auto">
          TURN YOUR{' '}
          <span className="text-[#F97316]">
            SKILL GAPS
          </span>{' '}
          INTO YOUR NEXT MOVE.
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-[#78716C] max-w-3xl mx-auto leading-relaxed font-normal">
          Understand exactly what stands between you and your target role — then get an AI-generated plan to close the gap.
          <span className="block mt-1 text-[#1C1917] font-semibold text-sm">
            "Don't just know your match. Know your next move."
          </span>
        </p>

        {/* Action CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to="/analyze"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-extrabold shadow-lg shadow-[#F97316]/25 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>ANALYZE MY RESUME →</span>
          </Link>

          <button
            onClick={handleDemoLaunch}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#FFFFFF] hover:bg-[#FAFAFA] text-[#1C1917] border border-[#E7E5E4] hover:border-[#F97316]/50 text-sm font-bold flex items-center justify-center gap-2.5 transition shadow-sm cursor-pointer"
          >
            <Play className="w-4 h-4 text-[#F97316] fill-[#F97316]/20" />
            <span>Try Live Demo Analysis</span>
          </button>
        </div>

        {/* ============================================================
            PRODUCT VISUALIZATION (MINIATURE UI)
            ============================================================ */}
        <div className="pt-10 relative">
          
          {/* Floating Insight Card 1 (Top Left) */}
          <div className="hidden lg:flex absolute -top-2 -left-8 z-20 items-center gap-3 p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#DC2626]/30 shadow-xl backdrop-blur-md animate-bounce" style={{ animationDuration: '6s' }}>
            <div className="w-8 h-8 rounded-xl bg-[#FEE2E2] border border-[#DC2626]/20 flex items-center justify-center text-[#DC2626]">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider">AI GAP DETECTED</div>
              <div className="text-xs font-black text-[#1C1917] flex items-center gap-1.5">
                Docker <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FEE2E2] text-[#DC2626] font-bold">HIGH PRIORITY</span>
              </div>
            </div>
          </div>

          {/* Floating Insight Card 2 (Bottom Left) */}
          <div className="hidden lg:flex absolute bottom-8 -left-10 z-20 items-center gap-3 p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#16A34A]/30 shadow-xl backdrop-blur-md animate-bounce" style={{ animationDuration: '7s' }}>
            <div className="w-8 h-8 rounded-xl bg-[#DCFCE7] border border-[#16A34A]/20 flex items-center justify-center text-[#16A34A]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider">ROADMAP STATUS</div>
              <div className="text-xs font-black text-[#16A34A]">2 / 6 MILESTONES DONE</div>
            </div>
          </div>

          {/* Floating Insight Card 3 (Top Right) */}
          <div className="hidden lg:flex absolute -top-4 -right-8 z-20 items-center gap-3 p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#F97316]/30 shadow-xl backdrop-blur-md animate-bounce" style={{ animationDuration: '8s' }}>
            <div className="w-8 h-8 rounded-xl bg-[#FFF3E8] border border-[#F97316]/20 flex items-center justify-center text-[#F97316]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider">JOB READINESS</div>
              <div className="text-xs font-black text-[#1C1917]">78% <span className="text-[#16A34A] font-bold">+14% this month</span></div>
            </div>
          </div>

          {/* Main Floating Interface Panel */}
          <div className="rounded-3xl border border-[#E7E5E4] bg-[#FFFFFF] shadow-xl p-6 sm:p-8 max-w-4xl mx-auto text-left relative overflow-hidden">
            
            {/* Window Bar Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E7E5E4]">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#FFF3E8] border border-[#F97316]/30 p-0.5 flex items-center justify-center shadow-sm">
                  <div className="w-full h-full bg-[#F97316] rounded-[14px] flex items-center justify-center font-mono font-black text-white text-xs">
                    AI
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-[#1C1917] text-base">Senior AI Engineer Analysis</h3>
                    <span className="px-2 py-0.5 rounded-full bg-[#DCFCE7] border border-[#16A34A]/30 text-[#16A34A] text-[10px] font-extrabold uppercase">
                      Target Match
                    </span>
                  </div>
                  <p className="text-xs text-[#78716C]">Applied ML & Inference Systems</p>
                </div>
              </div>

              {/* Readiness Score Widget */}
              <div className="flex items-center gap-4 bg-[#FAFAFA] border border-[#E7E5E4] px-4 py-2.5 rounded-2xl">
                <div className="text-right">
                  <div className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider">AI CAREER READINESS</div>
                  <div className="text-xs font-semibold text-[#16A34A] flex items-center justify-end gap-1">
                    <TrendingUp className="w-3 h-3" /> +14% this month
                  </div>
                </div>
                <div className="text-3xl font-black text-[#F97316] font-mono leading-none">
                  78%
                </div>
              </div>
            </div>

            {/* Interactive Tab Switcher */}
            <div className="flex items-center gap-2 my-5 border-b border-[#E7E5E4] pb-3 text-xs">
              <button
                onClick={() => setActiveTab('match')}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'match'
                    ? 'bg-[#F97316] text-white'
                    : 'text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAFAFA]'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Skill Alignment</span>
              </button>
              <button
                onClick={() => setActiveTab('gap')}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'gap'
                    ? 'bg-[#F97316] text-white'
                    : 'text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAFAFA]'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5 text-[#DC2626]" />
                <span>Gap Diagnostics</span>
              </button>
              <button
                onClick={() => setActiveTab('roadmap')}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'roadmap'
                    ? 'bg-[#F97316] text-white'
                    : 'text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAFAFA]'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-[#F97316]" />
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
                        <span className="text-[#1C1917] flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-[#16A34A]" /> Python & PyTorch
                        </span>
                        <span className="text-[#16A34A] font-mono font-bold">90%</span>
                      </div>
                      <div className="w-full bg-[#FAFAFA] rounded-full h-2 overflow-hidden border border-[#E7E5E4]">
                        <div className="bg-[#16A34A] h-full rounded-full" style={{ width: '90%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-[#1C1917] flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-[#16A34A]" /> RAG & Vector Databases
                        </span>
                        <span className="text-[#16A34A] font-mono font-bold">86%</span>
                      </div>
                      <div className="w-full bg-[#FAFAFA] rounded-full h-2 overflow-hidden border border-[#E7E5E4]">
                        <div className="bg-[#16A34A] h-full rounded-full" style={{ width: '86%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-[#1C1917] flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-[#16A34A]" /> SQL & Data Engineering
                        </span>
                        <span className="text-[#16A34A] font-mono font-bold">82%</span>
                      </div>
                      <div className="w-full bg-[#FAFAFA] rounded-full h-2 overflow-hidden border border-[#E7E5E4]">
                        <div className="bg-[#16A34A] h-full rounded-full" style={{ width: '82%' }} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-[#1C1917] flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-[#DC2626]" /> Docker & Containerization
                        </span>
                        <span className="text-[#DC2626] font-mono font-bold">20%</span>
                      </div>
                      <div className="w-full bg-[#FAFAFA] rounded-full h-2 overflow-hidden border border-[#E7E5E4]">
                        <div className="bg-[#DC2626] h-full rounded-full" style={{ width: '20%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-[#1C1917] flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-[#D97706]" /> AWS Cloud Deployments
                        </span>
                        <span className="text-[#D97706] font-mono font-bold">25%</span>
                      </div>
                      <div className="w-full bg-[#FAFAFA] rounded-full h-2 overflow-hidden border border-[#E7E5E4]">
                        <div className="bg-[#D97706] h-full rounded-full" style={{ width: '25%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-[#1C1917] flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-[#16A34A]" /> LLM Fine-Tuning (LoRA)
                        </span>
                        <span className="text-[#16A34A] font-mono font-bold">75%</span>
                      </div>
                      <div className="w-full bg-[#FAFAFA] rounded-full h-2 overflow-hidden border border-[#E7E5E4]">
                        <div className="bg-[#16A34A] h-full rounded-full" style={{ width: '75%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Gap Diagnostics */}
            {activeTab === 'gap' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-[#16A34A]/30 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1C1917]">Python / ML Ops</span>
                    <span className="text-[#16A34A] font-bold text-[11px] px-2 py-0.5 rounded bg-[#DCFCE7]">STRONG MATCH</span>
                  </div>
                  <p className="text-[11px] text-[#78716C]">"Deployed Transformer models processing 50k req/sec..."</p>
                  <span className="text-[10px] text-[#78716C] block">Validated with project repository link</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-[#DC2626]/30 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1C1917]">Docker / K8s</span>
                    <span className="text-[#DC2626] font-bold text-[11px] px-2 py-0.5 rounded bg-[#FEE2E2]">CRITICAL GAP</span>
                  </div>
                  <p className="text-[11px] text-[#78716C]">Required in job specification but missing in experience.</p>
                  <span className="text-[10px] text-[#F97316] font-semibold block">→ AI Project Blueprint Ready</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-[#D97706]/30 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1C1917]">AWS Production</span>
                    <span className="text-[#D97706] font-bold text-[11px] px-2 py-0.5 rounded bg-[#FEF3C7]">WEAK EVIDENCE</span>
                  </div>
                  <p className="text-[11px] text-[#78716C]">Listed as skill keyword but lacking metrics or architecture.</p>
                  <span className="text-[10px] text-[#D97706] font-semibold block">→ Needs quantitative scale proof</span>
                </div>
              </div>
            )}

            {/* Next Best Action Banner */}
            <div className="mt-5 p-4 rounded-2xl bg-[#FFF3E8] border border-[#F97316]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFFFFF] border border-[#F97316]/30 flex items-center justify-center text-[#F97316] shadow-sm">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#F97316] uppercase tracking-wider">NEXT BEST ACTION</div>
                  <div className="text-sm font-bold text-[#1C1917]">Complete Docker & Multi-Stage Build Fundamentals</div>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <span className="text-xs font-mono font-bold text-[#16A34A] px-2.5 py-1 rounded-lg bg-[#DCFCE7] border border-[#16A34A]/30">
                  +8 readiness points
                </span>
                <button
                  onClick={handleDemoLaunch}
                  className="px-4 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-[#E7E5E4] z-10">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#F97316]">The Intelligence Loop</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1C1917]">
            FROM UNCERTAINTY TO JOB-READY IN 5 STAGES
          </h2>
          <p className="text-sm text-[#78716C] max-w-xl mx-auto">
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
              className="p-5 rounded-2xl bg-[#FAFAFA] border border-[#E7E5E4] hover:border-[#F97316]/50 transition-all group relative space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-black text-[#F97316] transition">
                  {item.step}
                </span>
                <div className="w-2 h-2 rounded-full bg-[#F97316] group-hover:scale-150 transition" />
              </div>
              <h4 className="text-xs font-bold text-[#1C1917] tracking-wide">{item.title}</h4>
              <p className="text-[11px] text-[#78716C] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          DIFFERENTIATION MATRIX
          ============================================================ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-[#E7E5E4] z-10 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#F97316]">Why CareerGap AI</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1C1917]">
            BEYOND BRITTLE ATS KEYWORD SCORING
          </h2>
          <p className="text-sm text-[#78716C] max-w-xl mx-auto">
            Traditional resume checkers only count keywords. CareerGap AI understands engineering depth.
          </p>
        </div>

        <div className="rounded-3xl border border-[#E7E5E4] bg-[#FFFFFF] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E7E5E4] bg-[#FAFAFA] text-[11px] uppercase tracking-wider text-[#78716C]">
                  <th className="py-4 px-6 font-mono">Capability</th>
                  <th className="py-4 px-6 text-[#78716C]">Legacy ATS Checkers</th>
                  <th className="py-4 px-6 text-[#F97316] font-bold">CareerGap AI Intelligence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E5E4] text-xs">
                <tr>
                  <td className="py-4 px-6 font-bold text-[#1C1917]">Skill Understanding</td>
                  <td className="py-4 px-6 text-[#78716C]">Exact string matching (misses synonyms & context)</td>
                  <td className="py-4 px-6 text-[#16A34A] font-semibold">Semantic vector taxonomy + Implicit requirement mapping</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-bold text-[#1C1917]">Evidence Evaluation</td>
                  <td className="py-4 px-6 text-[#78716C]">Treats buzzwords in a list the same as production scale</td>
                  <td className="py-4 px-6 text-[#16A34A] font-semibold">Distinguishes Strong, Moderate, and Weak buzzwords with citations</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-bold text-[#1C1917]">Closing Skill Gaps</td>
                  <td className="py-4 px-6 text-[#78716C]">Tells you to stuff missing keywords into your text</td>
                  <td className="py-4 px-6 text-[#16A34A] font-semibold">Designs multi-skill portfolio projects & curated learning steps</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-bold text-[#1C1917]">Interview Readiness</td>
                  <td className="py-4 px-6 text-[#78716C]">None (leaves you unprepared for technical screens)</td>
                  <td className="py-4 px-6 text-[#16A34A] font-semibold">Voice & text mock interview simulator with rubric evaluation</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-bold text-[#1C1917]">Peer Benchmarks</td>
                  <td className="py-4 px-6 text-[#78716C]">Arbitrary black-box percentage score</td>
                  <td className="py-4 px-6 text-[#16A34A] font-semibold">Competency-by-competency radar percentiles against real candidates</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ============================================================
          6 CORE CAPABILITY PILLARS
          ============================================================ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-[#E7E5E4] z-10 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#F97316]">Full Engine Suite</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1C1917]">
            EVERYTHING YOU NEED TO LAND YOUR TARGET ROLE
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E7E5E4] hover:border-[#F97316]/60 transition space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#FFF3E8] border border-[#F97316]/30 flex items-center justify-center text-[#F97316]">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-[#1C1917] text-sm">Explainable Match Breakdown</h4>
            <p className="text-xs text-[#78716C] leading-relaxed">
              Every match score is accompanied by granular evidence sentences, taxonomy mappings, and confidence ratings.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E7E5E4] hover:border-[#F97316]/60 transition space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#FFF3E8] border border-[#F97316]/30 flex items-center justify-center text-[#F97316]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-[#1C1917] text-sm">Evidence Depth Analysis</h4>
            <p className="text-xs text-[#78716C] leading-relaxed">
              Identifies weak resume claims without metrics or outcomes, giving you instant rewriting suggestions.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E7E5E4] hover:border-[#F97316]/60 transition space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#FFF3E8] border border-[#F97316]/30 flex items-center justify-center text-[#F97316]">
              <Target className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-[#1C1917] text-sm">Project Blueprint Architecture</h4>
            <p className="text-xs text-[#78716C] leading-relaxed">
              Generates GitHub-ready project scopes, tech stack choices, and architecture diagrams to solve multiple gaps simultaneously.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E7E5E4] hover:border-[#F97316]/60 transition space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#FFF3E8] border border-[#F97316]/30 flex items-center justify-center text-[#F97316]">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-[#1C1917] text-sm">Actionable Roadmap Engine</h4>
            <p className="text-xs text-[#78716C] leading-relaxed">
              Organizes skills into high-priority weekly sprints with direct links to verified courses, docs, and certifications.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E7E5E4] hover:border-[#F97316]/60 transition space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#FFF3E8] border border-[#F97316]/30 flex items-center justify-center text-[#F97316]">
              <Mic className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-[#1C1917] text-sm">Voice Mock Interview Simulator</h4>
            <p className="text-xs text-[#78716C] leading-relaxed">
              Simulates realistic interview rounds targeting your weak areas with instant audio feedback and rubric scores.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E7E5E4] hover:border-[#F97316]/60 transition space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#FFF3E8] border border-[#F97316]/30 flex items-center justify-center text-[#F97316]">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-[#1C1917] text-sm">Peer Benchmarks & Comparison</h4>
            <p className="text-xs text-[#78716C] leading-relaxed">
              Compare your readiness percentile against target roles and benchmark multiple job offers side-by-side.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          BOTTOM CTA SECTION
          ============================================================ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-[#E7E5E4] text-center space-y-6 z-10">
        <div className="p-10 sm:p-14 rounded-3xl bg-[#FAFAFA] border border-[#E7E5E4] shadow-md relative overflow-hidden space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black text-[#1C1917] uppercase tracking-tight">
            READY TO CLOSE YOUR CAREER GAP?
          </h2>
          <p className="text-sm sm:text-base text-[#78716C] max-w-xl mx-auto">
            Upload your resume and target job description now to receive your personalized roadmap and gap diagnostics.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/analyze"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-extrabold shadow-lg shadow-[#F97316]/20 flex items-center justify-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>START FREE ANALYSIS →</span>
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#FFFFFF] hover:bg-[#F5F5F4] text-[#1C1917] border border-[#E7E5E4] text-sm font-bold flex items-center justify-center gap-2 transition"
            >
              <span>Create Account</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
          FOOTER
          ============================================================ */}
      <footer className="mt-auto py-8 border-t border-[#E7E5E4] bg-[#FAFAFA] text-center text-xs text-[#78716C] z-10 space-y-2">
        <div className="flex items-center justify-center gap-6 font-medium text-xs text-[#78716C]">
          <Link to="/analyze" className="hover:text-[#F97316] transition">Analyze</Link>
          <Link to="/benchmarks" className="hover:text-[#F97316] transition">Benchmarks</Link>
          <Link to="/multi-compare" className="hover:text-[#F97316] transition">Compare Jobs</Link>
          <Link to="/login" className="hover:text-[#F97316] transition">Sign In</Link>
          <Link to="/register" className="hover:text-[#F97316] transition">Get Started</Link>
        </div>
        <p>© 2026 CareerGap AI — AI Career Fit & Skill-Gap Intelligence Engine</p>
      </footer>

    </div>
  );
};
