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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#FFFFFF] text-[#1C1917] transition-colors relative overflow-hidden selection:bg-[#FFF3E8] selection:text-[#F97316]">
      
      {/* Subtle Warm Atmospheric Glows */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-[36rem] w-[36rem] rounded-full bg-[#F97316]/5 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 top-1/3 h-[28rem] w-[28rem] rounded-full bg-[#EA580C]/5 blur-3xl" />
      <div className="pointer-events-none absolute right-10 bottom-10 h-[30rem] w-[30rem] rounded-full bg-[#F97316]/5 blur-3xl" />

      {/* ============================================================
          LEFT PANEL (55% on Desktop): Product Showcase
          ============================================================ */}
      <div className="w-full lg:w-[55%] p-6 sm:p-10 lg:p-14 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#E7E5E4] bg-[#FAFAFA] relative z-10">
        
        {/* Top Brand Header */}
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#F97316] flex items-center justify-center shadow-lg shadow-[#F97316]/20 transition-transform group-hover:scale-105">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-[#1C1917] leading-none block">
                CareerGap <span className="text-[#F97316]">AI</span>
              </span>
              <span className="text-[11px] text-[#78716C] font-medium tracking-wide">
                Candidate Career Intelligence Platform
              </span>
            </div>
          </Link>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF3E8] text-[#F97316] border border-[#F97316]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
            <span>v2.4 Production Engine</span>
          </span>
        </div>

        {/* Hero Copy & Value Prop */}
        <div className="my-8 lg:my-10 space-y-6 max-w-xl">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#E7E5E4] text-xs font-semibold text-[#1C1917] shadow-sm">
              <Flame className="w-3.5 h-3.5 text-[#F97316]" />
              <span>Target Role Readiness Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#1C1917] leading-[1.15]">
              Don't just know your match.{' '}
              <span className="text-[#F97316]">
                Know your next move.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-[#78716C] leading-relaxed font-medium">
              Transform your resume into a mathematically grounded career roadmap. Benchmark against 10,000+ tech job requirements with explainable AI.
            </p>
          </div>

          {/* Interactive Intelligence Simulation Preview Card */}
          <div className="rounded-2xl border border-[#E7E5E4] bg-[#FFFFFF] p-5 shadow-sm space-y-4">
            
            {/* Simulation Header */}
            <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#78716C]">
                  Live Readiness Simulation
                </span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#FAFAFA] text-[#78716C] border border-[#E7E5E4]">
                Target: ML Engineer
              </span>
            </div>

            {/* Score Ring & Metric Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              
              {/* Radial Score Gauge */}
              <div className="sm:col-span-4 flex flex-col items-center justify-center p-3 rounded-xl bg-[#FAFAFA] border border-[#E7E5E4]">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-[#E7E5E4]"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#F97316] transition-all duration-1000"
                      strokeDasharray="78, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-black text-[#1C1917] leading-none">78%</span>
                    <span className="text-[9px] uppercase font-bold text-[#78716C]">Readiness</span>
                  </div>
                </div>
                <span className="mt-2 text-[10px] font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                  Competitive Tier
                </span>
              </div>

              {/* Breakdown Pillars */}
              <div className="sm:col-span-8 space-y-2">
                {[
                  { name: 'Python & PyTorch', pct: 95, color: '#16A34A', status: 'Matched' },
                  { name: 'MLOps & CI/CD', pct: 60, color: '#D97706', status: 'In Progress' },
                  { name: 'Docker & Kubernetes', pct: 30, color: '#DC2626', status: 'Missing' },
                ].map((skill, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs bg-[#FAFAFA] p-2 rounded-xl border border-[#E7E5E4]">
                    <span className="w-28 truncate font-semibold text-[#1C1917]">{skill.name}</span>
                    <div className="flex-1 h-2 rounded-full bg-[#E7E5E4] overflow-hidden">
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
            <div className="rounded-xl border border-[#F97316]/30 bg-[#FFF3E8] p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 truncate">
                <div className="w-8 h-8 rounded-lg bg-[#FFFFFF] border border-[#F97316]/30 flex items-center justify-center text-[#F97316] shrink-0 shadow-sm">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#F97316] block">
                    Next Best Action
                  </span>
                  <span className="text-xs font-bold text-[#1C1917] truncate block">
                    Complete Docker Fundamentals
                  </span>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#FFFFFF] text-[#F97316] border border-[#F97316]/30 shrink-0 shadow-sm">
                +8 readiness pts
              </span>
            </div>
          </div>
        </div>

        {/* Value Pillars */}
        <div className="space-y-3 pt-4 border-t border-[#E7E5E4]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-semibold text-[#78716C]">
            <div className="flex items-center gap-1.5">
              <span className="text-[#F97316]">✦</span>
              <span>Explainable AI matching</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#F97316]">✦</span>
              <span>Personalized skill-gap roadmap</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#F97316]">✦</span>
              <span>Project recommendations</span>
            </div>
          </div>

          <div className="text-[11px] text-[#78716C] font-mono opacity-80 pt-1">
            "Don't just know your match. Know your next move."
          </div>
        </div>
      </div>

      {/* ============================================================
          RIGHT PANEL (45% on Desktop): Auth Surface
          ============================================================ */}
      <div className="w-full lg:w-[45%] p-6 sm:p-10 lg:p-14 flex items-center justify-center relative z-10 bg-[#FFFFFF]">
        
        {/* Auth Panel */}
        <div className="w-full max-w-md rounded-3xl border border-[#E7E5E4] bg-[#FFFFFF] p-7 sm:p-9 shadow-lg space-y-6 relative transition-all">
          
          {/* Eyebrow & Heading */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#F97316] block">
              CAREERGAP AI • INTELLIGENCE PORTAL
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-[#1C1917]">
              Welcome back 👋
            </h2>
            <p className="text-xs text-[#78716C]">
              Continue your career intelligence journey.
            </p>
          </div>

          {/* 1-Click Demo Login */}
          <button
            onClick={handleDemoLogin}
            disabled={submitting}
            type="button"
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-md flex items-center justify-center gap-2 transition hover:bg-[#EA580C] disabled:opacity-50 cursor-pointer bg-[#F97316]"
          >
            <Sparkles className="w-4 h-4" />
            <span>1-Click Hackathon Demo Access</span>
          </button>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={submitting || loading}
            type="button"
            className="w-full py-2.5 px-4 rounded-xl border border-[#E7E5E4] bg-[#FAFAFA] hover:bg-[#F5F5F4] hover:border-[#F97316]/50 text-xs font-semibold text-[#1C1917] flex items-center justify-center gap-2.5 transition disabled:opacity-50 cursor-pointer"
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
            <div className="flex-grow border-t border-[#E7E5E4]" />
            <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-[#78716C]">
              or continue with email
            </span>
            <div className="flex-grow border-t border-[#E7E5E4]" />
          </div>

          {/* Input Fields */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl border border-[#DC2626]/30 bg-[#FEE2E2] text-xs text-[#DC2626] flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1C1917]">Email address</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-[#78716C]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-xl border border-[#E7E5E4] bg-[#FAFAFA] py-2.5 pl-10 pr-4 text-xs text-[#1C1917] placeholder-[#78716C] transition focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#1C1917]">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] font-semibold text-[#F97316] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-[#78716C]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-[#E7E5E4] bg-[#FAFAFA] py-2.5 pl-10 pr-10 text-xs text-[#1C1917] placeholder-[#78716C] transition focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#78716C] hover:text-[#1C1917] transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Primary Button */}
            <button
              type="submit"
              disabled={submitting || loading}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-md flex items-center justify-center gap-2 transition hover:bg-[#EA580C] disabled:opacity-50 cursor-pointer bg-[#F97316]"
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
          <div className="text-center pt-3 border-t border-[#E7E5E4]">
            <span className="text-xs text-[#78716C]">Don't have an account? </span>
            <Link
              to="/register"
              className="text-xs font-semibold text-[#F97316] hover:underline"
            >
              Create your free account →
            </Link>
          </div>

          <div className="text-center pt-1 text-[11px] text-[#78716C] flex items-center justify-center gap-1.5 opacity-80">
            <span>🔒 Authentication powered by Firebase</span>
          </div>
        </div>
      </div>
    </div>
  );
};
