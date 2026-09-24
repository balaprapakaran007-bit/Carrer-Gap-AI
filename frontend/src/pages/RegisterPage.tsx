import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  Mail,
  Lock,
  User,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Check,
  Loader2,
  ArrowRight,
  Target,
  Zap,
  BookOpen,
  Cpu,
  Workflow
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  const { register, loginWithGoogle, loginDemoUser, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await register(name, email, password);
      setAuthSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 400);
    } catch (err: any) {
      setError(err?.message || 'Account registration failed.');
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
        navigate('/dashboard');
      }, 400);
    } catch (err: any) {
      setError('Google Sign-In failed.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#07111F] text-[#F8FAFC] transition-colors relative overflow-hidden selection:bg-[#06D6FF] selection:text-[#07111F]">
      
      {/* Background Layered Glows */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-[36rem] w-[36rem] rounded-full bg-[#1677FF]/15 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 top-1/3 h-[28rem] w-[28rem] rounded-full bg-[#06D6FF]/10 blur-3xl" />
      <div className="pointer-events-none absolute right-10 bottom-10 h-[30rem] w-[30rem] rounded-full bg-[#14B8A6]/10 blur-3xl" />

      {/* Subtle Grid Lines */}
      <div className="pointer-events-none absolute inset-0 opacity-15 overflow-hidden">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="register-network-grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="40" cy="40" r="1.5" fill="#06D6FF" opacity="0.6" />
              <path d="M 40 40 L 80 80 M 40 40 L 0 80 M 40 40 L 80 0 M 40 40 L 0 0" stroke="#1E334D" strokeWidth="0.8" strokeDasharray="3,3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#register-network-grid)" />
        </svg>
      </div>

      {/* ============================================================
          LEFT PANEL (55% on Desktop): Career Intelligence Loop
          ============================================================ */}
      <div className="w-full lg:w-[55%] p-6 sm:p-10 lg:p-14 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#1E334D] relative z-10">
        
        {/* Brand Header */}
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
            <Workflow className="w-3.5 h-3.5" />
            <span>5-Stage Intelligence</span>
          </span>
        </div>

        {/* Headline & 12. Career Intelligence Loop */}
        <div className="my-8 lg:my-10 space-y-6 max-w-xl">
          <div className="space-y-2.5">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#F8FAFC] leading-[1.15]">
              BUILD YOUR <span className="bg-gradient-to-r from-[#06D6FF] via-[#38BDF8] to-[#1677FF] bg-clip-text text-transparent">CAREER INTELLIGENCE</span> PROFILE.
            </h1>
            <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed font-normal">
              Continuous gap coaching that turns job requirements into verified project milestones.
            </p>
          </div>

          {/* 12. CAREER INTELLIGENCE LOOP (01 to 05 with cyan/blue nodes) */}
          <div className="rounded-2xl border border-[#1E334D] bg-[#0F1D30]/90 backdrop-blur-xl p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E334D]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#06D6FF]">
                CAREER INTELLIGENCE LOOP
              </span>
              <span className="text-[10px] text-[#94A3B8] font-mono">Autonomous Architecture</span>
            </div>

            <div className="space-y-3">
              {[
                { num: '01', title: 'Resume Understanding', desc: 'Syntactical and semantic parsing of projects, skills, and evidence citations.' },
                { num: '02', title: 'Job Fit Analysis', desc: 'Real-time multi-dimensional scoring against targeted employer JD requirements.' },
                { num: '03', title: 'Skill Gap Detection', desc: 'Granular separation between strong, improving, and critical missing skills.' },
                { num: '04', title: 'Career Roadmap', desc: 'Data-derived step-by-step milestone execution plan with verified resources.' },
                { num: '05', title: 'Job Readiness', desc: 'Verified candidate credentials, portfolio proof, and mock interview mastery.' },
              ].map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl border border-[#1E334D] bg-[#07111F] transition hover:border-[#06D6FF]/50">
                  <div className="w-8 h-8 rounded-lg bg-[#1677FF]/20 border border-[#1677FF]/40 flex items-center justify-center text-xs font-mono font-bold text-[#06D6FF] shrink-0 mt-0.5">
                    {step.num}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#F8FAFC]">{step.title}</h4>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5 leading-snug">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-[11px] text-[#94A3B8] pt-4 border-t border-[#1E334D]">
          © {new Date().getFullYear()} CareerGap AI. Protected candidate intelligence data.
        </div>
      </div>

      {/* ============================================================
          RIGHT PANEL (45% on Desktop): Register Form
          ============================================================ */}
      <div className="w-full lg:w-[45%] p-6 sm:p-10 lg:p-14 flex items-center justify-center relative z-10">
        <div 
          className="w-full max-w-md rounded-3xl border border-[#1E334D] bg-[#0B1728] p-7 sm:p-9 shadow-2xl space-y-6 relative transition-all"
          style={{ boxShadow: '0 20px 50px -10px rgba(7, 17, 31, 0.9)' }}
        >
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#06D6FF] block">
              NEW CANDIDATE ONBOARDING
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-[#F8FAFC]">
              Create your account
            </h2>
            <p className="text-xs text-[#94A3B8]">
              Start closing your skill gaps with precision AI coaching.
            </p>
          </div>

          {/* Google Sign In */}
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

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-[#1E334D]" />
            <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-[#94A3B8]">
              or with email
            </span>
            <div className="flex-grow border-t border-[#1E334D]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl border border-[#EF4444]/40 bg-[#EF4444]/10 text-xs text-[#EF4444] flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#CBD5E1]">Full Name</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-[#94A3B8]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Chen"
                  required
                  className="w-full rounded-xl border border-[#1E334D] bg-[#07111F] py-2.5 pl-10 pr-4 text-xs text-[#F8FAFC] placeholder-[#64748B] transition focus:outline-none focus:border-[#06D6FF] focus:ring-2 focus:ring-[#06D6FF]/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#CBD5E1]">Email Address</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-[#94A3B8]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.chen@example.com"
                  required
                  className="w-full rounded-xl border border-[#1E334D] bg-[#07111F] py-2.5 pl-10 pr-4 text-xs text-[#F8FAFC] placeholder-[#64748B] transition focus:outline-none focus:border-[#06D6FF] focus:ring-2 focus:ring-[#06D6FF]/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#CBD5E1]">Password</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-[#94A3B8]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-xl border border-[#1E334D] bg-[#07111F] py-2.5 pl-10 pr-3 text-xs text-[#F8FAFC] placeholder-[#64748B] transition focus:outline-none focus:border-[#06D6FF] focus:ring-2 focus:ring-[#06D6FF]/20"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#CBD5E1]">Confirm</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-[#94A3B8]" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-xl border border-[#1E334D] bg-[#07111F] py-2.5 pl-10 pr-3 text-xs text-[#F8FAFC] placeholder-[#64748B] transition focus:outline-none focus:border-[#06D6FF] focus:ring-2 focus:ring-[#06D6FF]/20"
                  />
                </div>
              </div>
            </div>

            {/* Primary Button */}
            <button
              type="submit"
              disabled={submitting || loading}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-lg flex items-center justify-center gap-2 transition hover:opacity-95 disabled:opacity-50 cursor-pointer bg-gradient-to-r from-[#1677FF] to-[#06D6FF]"
              style={{ boxShadow: '0 0 20px -3px rgba(22, 119, 255, 0.4)' }}
            >
              {authSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white animate-in zoom-in-50 duration-200" />
                  <span>Account Created! Redirecting...</span>
                </>
              ) : submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Creating account...</span>
                </>
              ) : (
                <span>CREATE MY ACCOUNT →</span>
              )}
            </button>
          </form>

          <div className="text-center pt-3 border-t border-[#1E334D]">
            <span className="text-xs text-[#94A3B8]">Already have an account? </span>
            <Link
              to="/login"
              className="text-xs font-semibold text-[#06D6FF] hover:underline"
            >
              Sign in
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
