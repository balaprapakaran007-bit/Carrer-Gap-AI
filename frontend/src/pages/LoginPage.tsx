import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
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
  ArrowDownRight
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  const { loginWithEmail, loginWithGoogle, loginDemoUser, loading } = useAuth();
  const { theme } = useTheme();
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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[var(--background)] text-[var(--text)] transition-colors relative overflow-hidden selection:bg-[var(--primary)] selection:text-white">
      
      {/* BACKGROUND MESH GRADIENTS (Section 1) */}
      <div 
        className="pointer-events-none absolute -left-32 -top-32 h-[32rem] w-[32rem] rounded-full blur-3xl opacity-15"
        style={{ backgroundColor: 'var(--primary)' }}
      />
      <div 
        className="pointer-events-none absolute right-10 bottom-10 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: 'var(--primary)' }}
      />
      <div 
        className="pointer-events-none absolute left-1/3 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full blur-3xl opacity-8"
        style={{ backgroundColor: 'var(--primary)' }}
      />

      {/* ============================================================
          LEFT PANEL (55% on Desktop): Interactive Product Showcase
          ============================================================ */}
      <div className="w-full lg:w-[55%] p-6 sm:p-10 lg:p-14 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[var(--border)] relative z-10">
        
        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105"
              style={{ backgroundColor: 'var(--primary)', boxShadow: '0 0 20px -3px var(--primary-glow)' }}
            >
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-[var(--text)] leading-none block">
                CareerGap <span style={{ color: 'var(--primary)' }}>AI</span>
              </span>
              <span className="text-[11px] text-[var(--text-muted)] font-medium">
                Career Intelligence Engine
              </span>
            </div>
          </Link>

          <span 
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border"
            style={{
              backgroundColor: 'var(--primary-soft)',
              borderColor: 'var(--primary)',
              color: 'var(--primary)'
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Career Fit & Skill-Gap Platform</span>
          </span>
        </div>

        {/* Hero Copy */}
        <div className="my-8 lg:my-10 space-y-4 max-w-xl">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[var(--text)] leading-tight">
              Turn your <span style={{ color: 'var(--primary)' }}>skill gaps</span> into your next opportunity.
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-medium">
              Understand exactly what stands between you and your target role — then get an AI-generated plan to close the gap with verified project evidence.
            </p>
          </div>

          {/* 5. CAREER PROGRESS PATH VISUAL */}
          <div className="py-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--text-muted)] relative before:absolute before:left-3 before:right-3 before:top-2 before:h-0.5 before:bg-[var(--border)] before:-z-0">
              {[
                { label: 'Profile', active: true, done: true },
                { label: 'Skills', active: true, done: true },
                { label: 'Projects', active: true, done: false },
                { label: 'Job Ready', active: false, done: false },
              ].map((step, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5 z-10">
                  <div 
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold transition-all ${
                      step.done
                        ? 'text-white'
                        : step.active
                        ? 'ring-4 ring-[var(--primary-soft)] animate-pulse'
                        : 'bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-muted)]'
                    }`}
                    style={
                      step.done
                        ? { backgroundColor: 'var(--success)' }
                        : step.active
                        ? { backgroundColor: 'var(--primary)', color: '#fff' }
                        : {}
                    }
                  >
                    {step.done ? '✓' : idx + 1}
                  </div>
                  <span className={step.active ? 'text-[var(--text)] font-bold' : 'text-[var(--text-muted)]'}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. INTERACTIVE CAREER INTELLIGENCE VISUAL (Floating Mini-Dashboard Preview) */}
          <div className="relative pt-2">
            
            {/* Main Preview Container */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xl space-y-4 transition-all">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                  <div>
                    <span className="text-xs font-bold text-[var(--text)] block">
                      Target: Machine Learning Engineer
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)]">
                      AI Nexus Corp • Example Career Analysis
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-[var(--success)] bg-[var(--success-soft)] px-2.5 py-0.5 rounded-full border border-[var(--success)]/20">
                  +14% This Month
                </span>
              </div>

              {/* Central Ring & Metrics Row */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                
                {/* SVG Progress Ring */}
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        className="stroke-[var(--border)]"
                        strokeWidth="10"
                        fill="none"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        style={{ stroke: 'var(--primary)' }}
                        strokeWidth="10"
                        strokeDasharray={2 * Math.PI * 40}
                        strokeDashoffset={2 * Math.PI * 40 * (1 - 0.78)}
                        strokeLinecap="round"
                        fill="none"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-lg font-black leading-none" style={{ color: 'var(--primary)' }}>
                        78%
                      </span>
                      <span className="text-[8px] font-bold uppercase tracking-wider text-[var(--text-muted)] mt-0.5">
                        Match
                      </span>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-[var(--text)] block">Job Readiness Index</span>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      4 high-priority skills away from benchmark
                    </p>
                  </div>
                </div>

                {/* Semantic Color Breakdown Chips (Layer 2) */}
                <div className="grid grid-cols-3 gap-1.5 text-center w-full sm:w-auto">
                  <div className="p-2 rounded-xl bg-[var(--success-soft)] text-[var(--success)] border border-[var(--success)]/20">
                    <span className="text-xs font-bold block">12</span>
                    <span className="text-[9px] uppercase font-semibold">Matched</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[var(--warning-soft)] text-[var(--warning)] border border-[var(--warning)]/20">
                    <span className="text-xs font-bold block">3</span>
                    <span className="text-[9px] uppercase font-semibold">Weak</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[var(--danger-soft)] text-[var(--danger)] border border-[var(--danger)]/20">
                    <span className="text-xs font-bold block">4</span>
                    <span className="text-[9px] uppercase font-semibold">Missing</span>
                  </div>
                </div>
              </div>

              {/* Next Best Action Banner inside preview */}
              <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 truncate">
                  <div 
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: 'var(--primary-soft)', color: 'var(--primary)' }}
                  >
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                      Next Best Action
                    </span>
                    <span className="text-xs font-bold text-[var(--text)] truncate block">
                      Complete Docker Fundamentals
                    </span>
                  </div>
                </div>

                <span 
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 border"
                  style={{
                    backgroundColor: 'var(--primary-soft)',
                    borderColor: 'var(--primary)',
                    color: 'var(--primary)'
                  }}
                >
                  +8 readiness pts
                </span>
              </div>
            </div>

            {/* 4. FLOATING AI INSIGHT CARDS */}
            <div className="hidden sm:grid grid-cols-2 gap-3 mt-3">
              <div className="p-3 rounded-xl border border-[var(--danger)]/30 bg-[var(--surface)] shadow-lg space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className="text-[var(--danger)] flex items-center gap-1">
                    <ArrowDownRight className="w-3 h-3" /> Critical Gap
                  </span>
                  <span className="text-[var(--danger)]">-32% Gap</span>
                </div>
                <p className="text-[11px] font-bold text-[var(--text)]">Docker Containerization</p>
              </div>

              <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-lg space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span style={{ color: 'var(--primary)' }} className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Career Roadmap
                  </span>
                  <span className="text-[var(--text-muted)]">Step 2 of 6</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-[var(--border)] overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: '40%', backgroundColor: 'var(--primary)' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 6. VALUE PILLARS & 20. DIFFERENTIATOR BREAKDOWN */}
        <div className="space-y-3 pt-4 border-t border-[var(--border)]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-semibold text-[var(--text)]">
            <div className="flex items-center gap-1.5">
              <span style={{ color: 'var(--primary)' }}>✦</span>
              <span>Explainable AI matching</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span style={{ color: 'var(--primary)' }}>✦</span>
              <span>Personalized roadmaps</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span style={{ color: 'var(--primary)' }}>✦</span>
              <span>Project recommendations</span>
            </div>
          </div>

          <div className="text-[11px] text-[var(--text-muted)] flex flex-wrap items-center gap-2 pt-1 font-mono">
            <span className="opacity-70">Traditional ATS: Resume → Raw Score</span>
            <span>•</span>
            <span className="font-bold text-[var(--text)]">CareerGap AI: Resume → Skill Gap → Next Move</span>
          </div>
        </div>
      </div>

      {/* ============================================================
          RIGHT PANEL (45% on Desktop): Elevated Auth Panel
          ============================================================ */}
      <div className="w-full lg:w-[45%] p-6 sm:p-10 lg:p-14 flex items-center justify-center relative z-10">
        
        {/* Main Form Card (Section 7 & 8) */}
        <div 
          className="w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7 sm:p-9 shadow-2xl space-y-6 relative transition-all"
          style={{ boxShadow: '0 12px 36px -8px rgba(0, 0, 0, 0.25)' }}
        >
          {/* Eyebrow & Title */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] block">
              CareerGap AI • Intelligence Access
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)]">
              Welcome back 👋
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Continue your career intelligence journey.
            </p>
          </div>

          {/* 1-Click Hackathon Evaluation Login */}
          <button
            onClick={handleDemoLogin}
            disabled={submitting}
            type="button"
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-md flex items-center justify-center gap-2 transition hover:opacity-95 disabled:opacity-50 cursor-pointer"
            style={{ backgroundColor: 'var(--primary)', boxShadow: '0 0 16px -2px var(--primary-glow)' }}
          >
            <Sparkles className="w-4 h-4" />
            <span>1-Click Hackathon Demo Access</span>
          </button>

          {/* Google Login (Section 10 — Neutral Brand styling per Google Guidelines) */}
          <button
            onClick={handleGoogleLogin}
            disabled={submitting || loading}
            type="button"
            className="w-full py-2.5 px-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] text-xs font-semibold text-[var(--text)] flex items-center justify-center gap-2.5 transition hover:border-[var(--border-strong)] disabled:opacity-50 cursor-pointer"
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
            <div className="flex-grow border-t border-[var(--border)]" />
            <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-[var(--text-muted)]">
              or continue with email
            </span>
            <div className="flex-grow border-t border-[var(--border)]" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl border border-[var(--danger)]/30 bg-[var(--danger-soft)] text-xs text-[var(--danger)] flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-muted)]">Email Address</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-[var(--text-muted)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.chen@example.com"
                  required
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] py-2.5 pl-10 pr-4 text-xs text-[var(--text)] transition focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[var(--text-muted)]">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] font-semibold text-[var(--primary)] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-[var(--text-muted)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] py-2.5 pl-10 pr-10 text-xs text-[var(--text)] transition focus:outline-none focus:border-[var(--primary)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[var(--text-muted)] hover:text-[var(--text)] transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Primary Sign In Button (Section 11 Micro-interaction) */}
            <button
              type="submit"
              disabled={submitting || loading}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-md flex items-center justify-center gap-2 transition hover:opacity-95 disabled:opacity-50 cursor-pointer"
              style={{
                backgroundColor: authSuccess ? 'var(--success)' : 'var(--primary)',
                boxShadow: '0 0 16px -2px var(--primary-glow)'
              }}
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
                <span>Sign in →</span>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="text-center pt-3 border-t border-[var(--border)]">
            <span className="text-xs text-[var(--text-muted)]">Don't have an account? </span>
            <Link
              to="/register"
              className="text-xs font-semibold text-[var(--primary)] hover:underline"
            >
              Create your free account →
            </Link>
          </div>

          {/* 9. Trust Indicator */}
          <div className="text-center pt-1 text-[11px] text-[var(--text-muted)] flex items-center justify-center gap-1.5 opacity-80">
            <span>🔒 Authentication powered by Firebase</span>
          </div>
        </div>
      </div>
    </div>
  );
};
