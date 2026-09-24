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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#FFFFFF] text-[#1C1917] transition-colors relative overflow-hidden selection:bg-[#FFF3E8] selection:text-[#F97316]">
      
      {/* Background Layered Glows */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-[36rem] w-[36rem] rounded-full bg-[#F97316]/5 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 top-1/3 h-[28rem] w-[28rem] rounded-full bg-[#EA580C]/5 blur-3xl" />
      <div className="pointer-events-none absolute right-10 bottom-10 h-[30rem] w-[30rem] rounded-full bg-[#F97316]/5 blur-3xl" />

      {/* ============================================================
          LEFT PANEL (55% on Desktop): Career Intelligence Loop
          ============================================================ */}
      <div className="w-full lg:w-[55%] p-6 sm:p-10 lg:p-14 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#E7E5E4] bg-[#FAFAFA] relative z-10">
        
        {/* Brand Header */}
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
                Career Intelligence Engine
              </span>
            </div>
          </Link>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#FFF3E8] border border-[#F97316]/30 text-[#F97316] shadow-sm">
            <Workflow className="w-3.5 h-3.5" />
            <span>5-Stage Intelligence</span>
          </span>
        </div>

        {/* Headline & Career Intelligence Loop */}
        <div className="my-8 lg:my-10 space-y-6 max-w-xl">
          <div className="space-y-2.5">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#1C1917] leading-[1.15]">
              BUILD YOUR <span className="text-[#F97316]">CAREER INTELLIGENCE</span> PROFILE.
            </h1>
            <p className="text-xs sm:text-sm text-[#78716C] leading-relaxed font-normal">
              Continuous gap coaching that turns job requirements into verified project milestones.
            </p>
          </div>

          {/* Career Intelligence Loop */}
          <div className="rounded-2xl border border-[#E7E5E4] bg-[#FFFFFF] p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E5E4]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#F97316]">
                CAREER INTELLIGENCE LOOP
              </span>
              <span className="text-[10px] text-[#78716C] font-mono">Autonomous Architecture</span>
            </div>

            <div className="space-y-3">
              {[
                { num: '01', title: 'Resume Understanding', desc: 'Syntactical and semantic parsing of projects, skills, and evidence citations.' },
                { num: '02', title: 'Job Fit Analysis', desc: 'Real-time multi-dimensional scoring against targeted employer JD requirements.' },
                { num: '03', title: 'Skill Gap Detection', desc: 'Granular separation between strong, improving, and critical missing skills.' },
                { num: '04', title: 'Personalized Roadmap', desc: 'Curated sequence of high-impact portfolio projects and verified learning modules.' },
                { num: '05', title: 'Interactive Readiness', desc: 'AI mock interview simulation and peer cohort benchmark tracking.' }
              ].map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl border border-[#E7E5E4] bg-[#FAFAFA] transition hover:border-[#F97316]/50">
                  <span className="text-xs font-mono font-bold text-[#F97316] w-6 pt-0.5">
                    {step.num}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-[#1C1917]">{step.title}</h4>
                    <p className="text-[11px] text-[#78716C] leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security Footer */}
        <div className="flex items-center justify-between text-[11px] text-[#78716C] pt-4 border-t border-[#E7E5E4]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
            <span>Encrypted candidates repository</span>
          </div>
          <span>v2.4 Production Engine</span>
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
              START YOUR JOURNEY
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-[#1C1917]">
              Create Account 🚀
            </h2>
            <p className="text-xs text-[#78716C]">
              Join thousands of engineers closing their career gaps.
            </p>
          </div>

          {/* Google Sign Up */}
          <button
            onClick={handleGoogleLogin}
            disabled={submitting || loading}
            type="button"
            className="w-full py-2.5 px-4 rounded-xl border border-[#E7E5E4] bg-[#FAFAFA] hover:bg-[#F5F5F4] hover:border-[#F97316]/50 text-xs font-semibold text-[#1C1917] flex items-center justify-center gap-2.5 transition disabled:opacity-50 cursor-pointer shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Sign up with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-[#E7E5E4]" />
            <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-[#78716C]">
              or register with email
            </span>
            <div className="flex-grow border-t border-[#E7E5E4]" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl border border-[#DC2626]/30 bg-[#FEE2E2] text-xs text-[#DC2626] flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1C1917]">Full Name</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-[#78716C]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Chen"
                  required
                  className="w-full rounded-xl border border-[#E7E5E4] bg-[#FAFAFA] py-2.5 pl-10 pr-4 text-xs text-[#1C1917] placeholder-[#78716C] transition focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1C1917]">Email Address</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-[#78716C]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.chen@example.com"
                  required
                  className="w-full rounded-xl border border-[#E7E5E4] bg-[#FAFAFA] py-2.5 pl-10 pr-4 text-xs text-[#1C1917] placeholder-[#78716C] transition focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1C1917]">Password</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-[#78716C]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-xl border border-[#E7E5E4] bg-[#FAFAFA] py-2.5 pl-10 pr-3 text-xs text-[#1C1917] placeholder-[#78716C] transition focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1C1917]">Confirm</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-[#78716C]" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-xl border border-[#E7E5E4] bg-[#FAFAFA] py-2.5 pl-10 pr-3 text-xs text-[#1C1917] placeholder-[#78716C] transition focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20"
                  />
                </div>
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

          <div className="text-center pt-3 border-t border-[#E7E5E4]">
            <span className="text-xs text-[#78716C]">Already have an account? </span>
            <Link
              to="/login"
              className="text-xs font-semibold text-[#F97316] hover:underline"
            >
              Sign in
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
