import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  Sparkles,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Zap,
  Target,
  TrendingUp,
  Award,
  Layers,
  Check,
  Loader2,
  ShieldCheck,
  Flame,
  ArrowDownRight,
  Cpu,
  Workflow
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  const { loginWithEmail, loginWithGoogle, loginDemoUser, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await loginWithEmail(email, password);
      setAuthSuccess(true);
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 400);
    } catch (err: any) {
      setError(err?.message || 'Invalid email or password.');
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setSubmitting(true);
    try {
      await loginWithGoogle();
      setAuthSuccess(true);
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 400);
    } catch (err: any) {
      setError(err?.message || 'Google sign-in failed.');
      setSubmitting(false);
    }
  };

  const handleDemoLogin = () => {
    setSubmitting(true);
    loginDemoUser();
    setAuthSuccess(true);
    setTimeout(() => {
      navigate(from, { replace: true });
    }, 300);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#07111F] text-[#F8FAFC] transition-colors relative overflow-hidden selection:bg-[#06D6FF] selection:text-[#07111F]">
      
      {/* 3. HAVENMATCH-INSPIRED LAYERED ATMOSPHERIC GLOWS */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-[36rem] w-[36rem] rounded-full bg-[#1677FF]/15 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 top-1/3 h-[28rem] w-[28rem] rounded-full bg-[#06D6FF]/10 blur-3xl" />
      <div className="pointer-events-none absolute right-10 bottom-10 h-[30rem] w-[30rem] rounded-full bg-[#14B8A6]/10 blur-3xl" />

      {/* 4. SUBTLE AI NETWORK BACKGROUND LINES */}
      <div className="pointer-events-none absolute inset-0 opacity-15 overflow-hidden">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="network-grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="40" cy="40" r="1.5" fill="#06D6FF" opacity="0.6" />
              <path d="M 40 40 L 80 80 M 40 40 L 0 80 M 40 40 L 80 0 M 40 40 L 0 0" stroke="#1E334D" strokeWidth="0.8" strokeDasharray="3,3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#network-grid)" />
        </svg>
      </div>

      {/* ============================================================
          LEFT PANEL (55% on Desktop): Haven-Style Product Showcase
          ============================================================ */}
      <div className="w-full lg:w-[55%] p-6 sm:p-10 lg:p-14 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#1E334D] relative z-10">
        
        {/* Top Brand Header */}
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1677FF] to-[#06D6FF] flex items-center justify-center shadow-lg shadow-[#1677FF]/30 transition-transform group-hover:scale-105">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-[#F8FAFC] leading-none block">
                CareerGap <span className="text-[#06D6FF]">AI</span>
              </span>
              <span className="text-[11px] text-[#94A3B8] font-medium tracking-wide">
                Career Intelligence Engine
              </span>
            </div>
          </Link>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#0F1D30] border border-[#06D6FF]/30 text-[#06D6FF] shadow-sm">
            <Cpu className="w-3.5 h-3.5" />
            <span>Precision Fit Engine</span>
          </span>
        </div>

        {/* 5. MAIN HEADLINE & COPY */}
        <div className="my-8 lg:my-10 space-y-6 max-w-xl">
          <div className="space-y-2.5">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#F8FAFC] leading-[1.15]">
              TURN YOUR <span className="bg-gradient-to-r from-[#06D6FF] via-[#38BDF8] to-[#1677FF] bg-clip-text text-transparent">SKILL GAPS</span> INTO YOUR NEXT OPPORTUNITY.
            </h1>
            <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed font-normal">
              Understand exactly what stands between you and your target role — then get an AI-generated plan to close the gap with verified project proof.
            </p>
          </div>

          {/* 6. PRODUCT VISUALIZATION (Miniature CareerGap AI analysis interface) */}
          <div className="relative pt-2">
            
            {/* Main Floating Panel */}
            <div className="rounded-2xl border border-[#1E334D] bg-[#0F1D30]/90 backdrop-blur-xl p-5 sm:p-6 shadow-2xl space-y-5 transition-all">
              
              {/* Top Row: Target Role & Readiness */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E334D]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#1677FF]/20 border border-[#1677FF]/40 flex items-center justify-center text-[#06D6FF]">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#94A3B8] block">
                      Target Role Analysis
                    </span>
                    <h3 className="text-sm font-bold text-[#F8FAFC]">
                      Machine Learning Engineer
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-[#0B1728] px-3 py-1.5 rounded-xl border border-[#1E334D]">
                  <div className="text-right">
                    <span className="text-lg font-black text-[#06D6FF] leading-none block">78%</span>
                    <span className="text-[9px] uppercase font-bold text-[#94A3B8]">Job Ready</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#14B8A6] bg-[#14B8A6]/15 px-2 py-0.5 rounded-md">
                    +14% this month
                  </span>
                </div>
              </div>

              {/* Skill Alignment Horizontal Bars */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
                  <span>Skill Alignment</span>
                  <span className="text-[#06D6FF]">Proficiency vs Role Need</span>
                </div>

                {/* Strong Skills (Teal) */}
                <div className="space-y-1.5">
                  {[
                    { name: 'Python 3.12', pct: 90, color: '#14B8A6', status: 'Matched' },
                    { name: 'SQL Relational', pct: 82, color: '#14B8A6', status: 'Matched' },
                    { name: 'RAG Architecture', pct: 86, color: '#14B8A6', status: 'Matched' },
                    { name: 'Docker Containers', pct: 20, color: '#EF4444', status: 'Missing' },
                    { name: 'AWS Cloud Microservices', pct: 25, color: '#EF4444', status: 'Missing' },
                  ].map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs bg-[#07111F] p-2 rounded-xl border border-[#1E334D]/60">
                      <span className="w-28 truncate font-semibold text-[#F8FAFC]">{skill.name}</span>
                      <div className="flex-1 h-2 rounded-full bg-[#13243A] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${skill.pct}%`,
                            backgroundColor: skill.color
                          }}
                        />
                      </div>
                      <span className="w-8 text-right font-mono text-[11px] font-bold" style={{ color: skill.color }}>
                        {skill.pct}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Best Action Card */}
              <div className="rounded-xl border border-[#06D6FF]/40 bg-[#0B1728] p-3.5 flex items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-3 truncate">
                  <div className="w-8 h-8 rounded-lg bg-[#1677FF]/20 border border-[#1677FF]/40 flex items-center justify-center text-[#06D6FF] shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#06D6FF] block">
                      Next Best Action
                    </span>
                    <span className="text-xs font-bold text-[#F8FAFC] truncate block">
                      Complete Docker Fundamentals
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#1677FF]/20 text-[#06D6FF] border border-[#1677FF]/30 shrink-0">
                  +8 readiness pts
                </span>
              </div>
            </div>

            {/* 7. FLOATING INSIGHT CARDS */}
            <div className="hidden sm:grid grid-cols-3 gap-3 mt-3">
              <div className="p-3 rounded-xl border border-[#EF4444]/40 bg-[#0F1D30] shadow-xl space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold text-[#EF4444]">
                  <span>AI GAP DETECTED</span>
                  <span>HIGH</span>
                </div>
                <p className="text-xs font-bold text-[#F8FAFC] truncate">Docker Containerization</p>
              </div>

              <div className="p-3 rounded-xl border border-[#06D6FF]/40 bg-[#0F1D30] shadow-xl space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold text-[#06D6FF]">
                  <span>ROADMAP</span>
                  <span>2 / 6</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-[#1E334D] overflow-hidden mt-1">
                  <div className="h-full bg-[#06D6FF] rounded-full" style={{ width: '33%' }} />
                </div>
              </div>

              <div className="p-3 rounded-xl border border-[#14B8A6]/40 bg-[#0F1D30] shadow-xl space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold text-[#14B8A6]">
                  <span>JOB READINESS</span>
                  <span>+14%</span>
                </div>
                <p className="text-xs font-bold text-[#F8FAFC]">78% Benchmark</p>
              </div>
            </div>
          </div>
        </div>

        {/* Value Pillars */}
        <div className="space-y-3 pt-4 border-t border-[#1E334D]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-semibold text-[#CBD5E1]">
            <div className="flex items-center gap-1.5">
              <span className="text-[#06D6FF]">✦</span>
              <span>Explainable AI matching</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#06D6FF]">✦</span>
              <span>Personalized skill-gap roadmap</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#06D6FF]">✦</span>
              <span>Project recommendations</span>
            </div>
          </div>

          <div className="text-[11px] text-[#94A3B8] font-mono opacity-80 pt-1">
            "Don't just know your match. Know your next move."
          </div>
        </div>
      </div>

      {/* ============================================================
          RIGHT PANEL (45% on Desktop): Premium Dark Auth Surface
          ============================================================ */}
      <div className="w-full lg:w-[45%] p-6 sm:p-10 lg:p-14 flex items-center justify-center relative z-10">
        
        {/* 8. AUTH PANEL (#0B1728, border #1E334D, radius 20px) */}
        <div 
          className="w-full max-w-md rounded-3xl border border-[#1E334D] bg-[#0B1728] p-7 sm:p-9 shadow-2xl space-y-6 relative transition-all"
          style={{ boxShadow: '0 20px 50px -10px rgba(7, 17, 31, 0.9)' }}
        >
          {/* Eyebrow & Heading */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#06D6FF] block">
              CAREERGAP AI • INTELLIGENCE PORTAL
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-[#F8FAFC]">
              Welcome back 👋
            </h2>
            <p className="text-xs text-[#94A3B8]">
              Continue your career intelligence journey.
            </p>
          </div>

          {/* 1-Click Demo Login */}
          <button
            onClick={handleDemoLogin}
            disabled={submitting}
            type="button"
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-lg flex items-center justify-center gap-2 transition hover:opacity-95 disabled:opacity-50 cursor-pointer bg-gradient-to-r from-[#1677FF] to-[#06D6FF]"
            style={{ boxShadow: '0 0 20px -3px rgba(22, 119, 255, 0.4)' }}
          >
            <Sparkles className="w-4 h-4" />
            <span>1-Click Hackathon Demo Access</span>
          </button>

          {/* 9. GOOGLE LOGIN */}
          <button
            onClick={handleGoogleLogin}
            disabled={submitting || loading}
            type="button"
            className="w-full py-2.5 px-4 rounded-xl border border-[#1E334D] bg-[#0F1D30] hover:bg-[#13243A] hover:border-[#1677FF]/60 text-xs font-semibold text-[#F8FAFC] flex items-center justify-center gap-2.5 transition disabled:opacity-50 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-[#1E334D]" />
            <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-[#94A3B8]">
              or continue with email
            </span>
            <div className="flex-grow border-t border-[#1E334D]" />
          </div>

          {/* 10. INPUT FIELDS (#07111F, border #1E334D, focus cyan glow) */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl border border-[#EF4444]/40 bg-[#EF4444]/10 text-xs text-[#EF4444] flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#CBD5E1]">Email address</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-[#94A3B8]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-xl border border-[#1E334D] bg-[#07111F] py-2.5 pl-10 pr-4 text-xs text-[#F8FAFC] placeholder-[#64748B] transition focus:outline-none focus:border-[#06D6FF] focus:ring-2 focus:ring-[#06D6FF]/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#CBD5E1]">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] font-semibold text-[#06D6FF] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-[#94A3B8]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-[#1E334D] bg-[#07111F] py-2.5 pl-10 pr-10 text-xs text-[#F8FAFC] placeholder-[#64748B] transition focus:outline-none focus:border-[#06D6FF] focus:ring-2 focus:ring-[#06D6FF]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#94A3B8] hover:text-[#F8FAFC] transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 11. PRIMARY BUTTON (#1677FF to #06D6FF gradient) */}
            <button
              type="submit"
              disabled={submitting || loading}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-lg flex items-center justify-center gap-2 transition hover:opacity-95 disabled:opacity-50 cursor-pointer bg-gradient-to-r from-[#1677FF] to-[#06D6FF]"
              style={{ boxShadow: '0 0 20px -3px rgba(22, 119, 255, 0.4)' }}
            >
              {authSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white animate-in zoom-in-50 duration-200" />
                  <span>Authenticated! Redirecting...</span>
                </>
              ) : submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>SIGN IN →</span>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="text-center pt-3 border-t border-[#1E334D]">
            <span className="text-xs text-[#94A3B8]">Don't have an account? </span>
            <Link
              to="/register"
              className="text-xs font-semibold text-[#06D6FF] hover:underline"
            >
              Create your free account →
            </Link>
          </div>

          <div className="text-center pt-1 text-[11px] text-[#94A3B8] flex items-center justify-center gap-1.5 opacity-80">
            <span>🔒 Authentication powered by Firebase</span>
          </div>
        </div>
      </div>
    </div>
  );
};
