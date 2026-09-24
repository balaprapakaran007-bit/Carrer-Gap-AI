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
  BookOpen
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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[var(--background)] text-[var(--text)] transition-colors relative overflow-hidden selection:bg-[var(--primary)] selection:text-white">
      
      {/* Background Mesh */}
      <div 
        className="pointer-events-none absolute -left-32 -top-32 h-[32rem] w-[32rem] rounded-full blur-3xl opacity-15"
        style={{ backgroundColor: 'var(--primary)' }}
      />
      <div 
        className="pointer-events-none absolute right-10 bottom-10 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: 'var(--primary)' }}
      />

      {/* ============================================================
          LEFT PANEL (55% on Desktop): Career Journey Showcase
          ============================================================ */}
      <div className="w-full lg:w-[55%] p-6 sm:p-10 lg:p-14 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[var(--border)] relative z-10">
        
        {/* Header */}
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
                Career Intelligence Platform
              </span>
            </div>
          </Link>
        </div>

        {/* Journey Copy & Milestones */}
        <div className="my-8 lg:my-10 space-y-6 max-w-xl">
          <div className="space-y-2">
            <span 
              className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border inline-block"
              style={{
                backgroundColor: 'var(--primary-soft)',
                borderColor: 'var(--primary)',
                color: 'var(--primary)'
              }}
            >
              Your Career Journey
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[var(--text)] leading-tight">
              Build your career intelligence profile.
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-medium">
              Join thousands of engineers closing critical skill gaps and landing top tech roles with AI-driven gap coaching.
            </p>
          </div>

          {/* Step Sequence Container */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
              Continuous Intelligence Loop
            </span>

            <div className="space-y-3">
              {[
                { title: '1. Resume Verification', desc: 'Deep parsing of achievements, technical skills, and evidence citations.' },
                { title: '2. Job Fit & Gap Scoring', desc: 'Exact match %, weak evidence flags, and critical missing requirements.' },
                { title: '3. Strategic Career Roadmap', desc: 'Actionable milestones to close missing skills with hands-on projects.' },
                { title: '4. Interview Simulator', desc: 'AI mock technical rounds targeting your specific gap areas.' }
              ].map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]">
                  <div 
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                    style={{ backgroundColor: 'var(--primary-soft)', color: 'var(--primary)' }}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[var(--text)]">{step.title}</h4>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-[11px] text-[var(--text-muted)] pt-4 border-t border-[var(--border)]">
          © {new Date().getFullYear()} CareerGap AI. All candidate data stored privately with Firebase encryption.
        </div>
      </div>

      {/* ============================================================
          RIGHT PANEL (45% on Desktop): Register Form
          ============================================================ */}
      <div className="w-full lg:w-[45%] p-6 sm:p-10 lg:p-14 flex items-center justify-center relative z-10">
        <div 
          className="w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7 sm:p-9 shadow-2xl space-y-6"
          style={{ boxShadow: '0 12px 36px -8px rgba(0, 0, 0, 0.25)' }}
        >
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] block">
              New Candidate Account
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)]">
              Create your account
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Start closing your skill gaps with precision AI coaching.
            </p>
          </div>

          {/* Google Sign In */}
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

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-[var(--border)]" />
            <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-[var(--text-muted)]">
              or with email
            </span>
            <div className="flex-grow border-t border-[var(--border)]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl border border-[var(--danger)]/30 bg-[var(--danger-soft)] text-xs text-[var(--danger)] flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-muted)]">Full Name</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Chen"
                  required
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] py-2.5 pl-10 pr-4 text-xs text-[var(--text)] transition focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
            </div>

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-muted)]">Password</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-[var(--text-muted)]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] py-2.5 pl-10 pr-3 text-xs text-[var(--text)] transition focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-muted)]">Confirm</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-[var(--text-muted)]" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] py-2.5 pl-10 pr-3 text-xs text-[var(--text)] transition focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
              </div>
            </div>

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
                  <span>Account Created! Redirecting...</span>
                </>
              ) : submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Create my account →</span>
              )}
            </button>
          </form>

          <div className="text-center pt-3 border-t border-[var(--border)]">
            <span className="text-xs text-[var(--text-muted)]">Already have an account? </span>
            <Link
              to="/login"
              className="text-xs font-semibold text-[var(--primary)] hover:underline"
            >
              Sign in
            </Link>
          </div>

          <div className="text-center pt-1 text-[11px] text-[var(--text-muted)] flex items-center justify-center gap-1.5 opacity-80">
            <span>🔒 Authentication powered by Firebase</span>
          </div>
        </div>
      </div>
    </div>
  );
};
