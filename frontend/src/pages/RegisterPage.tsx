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
  Target
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Account registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setSubmitting(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      setError('Google Sign-In failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[var(--background)] text-[var(--text)] transition-colors">
      
      {/* LEFT PANEL: Brand Info & Onboarding Value */}
      <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[var(--border)] relative overflow-hidden bg-[var(--surface)]">
        <div 
          className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full blur-3xl opacity-15"
          style={{ backgroundColor: 'var(--primary)' }}
        />

        <div className="flex items-center gap-3 relative z-10">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-[var(--primary)]/20"
            style={{ backgroundColor: 'var(--primary)' }}
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
        </div>

        <div className="my-10 space-y-6 relative z-10 max-w-lg">
          <div className="space-y-2">
            <span 
              className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border"
              style={{
                backgroundColor: 'var(--primary-soft)',
                borderColor: 'var(--primary)',
                color: 'var(--primary)'
              }}
            >
              Candidate Onboarding
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--text)] leading-tight">
              Build your career intelligence profile today.
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              Upload your verified experience, benchmark against real market demands, and let AI generate your step-by-step career roadmap.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { title: 'Granular Skill Gap Analysis', desc: 'Pinpoints exact missing capabilities and weak resume proof.' },
              { title: 'Data-Grounded Roadmaps', desc: 'Actionable milestones to close gaps in weeks, not years.' },
              { title: 'Interactive Interview Simulator', desc: 'AI mock technical rounds tailored to your target job.' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]">
                <CheckCircle2 className="w-4 h-4 text-[var(--success)] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[var(--text)]">{item.title}</h4>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-[11px] text-[var(--text-muted)] relative z-10">
          © {new Date().getFullYear()} CareerGap AI. All candidate data stored privately.
        </div>
      </div>

      {/* RIGHT PANEL: Register Form */}
      <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex items-center justify-center bg-[var(--background)]">
        <div className="w-full max-w-md space-y-6">
          
          <div className="space-y-1">
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
            className="w-full py-2.5 px-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs font-semibold text-[var(--text)] flex items-center justify-center gap-2.5 transition hover:border-[var(--border-strong)] disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Sign up with Google</span>
          </button>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-[var(--border)]" />
            <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-[var(--text-muted)]">Or with email</span>
            <div className="flex-grow border-t border-[var(--border)]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl border border-[var(--danger)]/30 bg-[var(--danger-soft)] text-xs text-[var(--danger)] flex items-center gap-2">
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
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-10 pr-4 text-xs text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
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
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-10 pr-4 text-xs text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
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
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-10 pr-3 text-xs text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
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
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-10 pr-3 text-xs text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || loading}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-md flex items-center justify-center gap-2 transition hover:opacity-95 disabled:opacity-50"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              <span>{submitting ? 'Creating account...' : 'Create my account →'}</span>
            </button>
          </form>

          <div className="text-center pt-2 border-t border-[var(--border)]">
            <span className="text-xs text-[var(--text-muted)]">Already have an account? </span>
            <Link
              to="/login"
              className="text-xs font-semibold text-[var(--primary)] hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
