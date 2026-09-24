import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  KeyRound,
  Loader2,
  Check
} from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { resetPassword, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await resetPassword(email);
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || 'Could not send password reset email.');
    } finally {
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

      {/* LEFT PANEL */}
      <div className="w-full lg:w-[55%] p-6 sm:p-10 lg:p-14 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[var(--border)] relative z-10">
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
              Account Security & Recovery
            </span>
          </div>
        </Link>

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
              Account Recovery
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[var(--text)] leading-tight">
              Regain access to your career roadmaps.
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-medium">
              We'll send a secure password reset link directly to your verified email address so you can get back to tracking skill progression.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xl space-y-3">
            <div className="flex items-center gap-3">
              <div 
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'var(--primary-soft)', color: 'var(--primary)' }}
              >
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[var(--text)]">End-to-End Encrypted Auth</h4>
                <p className="text-[11px] text-[var(--text-muted)]">Direct integration with Firebase Authentication</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-[var(--text-muted)] pt-4 border-t border-[var(--border)]">
          © {new Date().getFullYear()} CareerGap AI. Protected candidate intelligence data.
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-[45%] p-6 sm:p-10 lg:p-14 flex items-center justify-center relative z-10">
        <div 
          className="w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7 sm:p-9 shadow-2xl space-y-6"
          style={{ boxShadow: '0 12px 36px -8px rgba(0, 0, 0, 0.25)' }}
        >
          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)]">
              Reset Password
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Enter your email address to receive your recovery link.
            </p>
          </div>

          {submitted ? (
            <div className="rounded-2xl border border-[var(--success)]/30 bg-[var(--success-soft)] p-5 space-y-3 text-center animate-in zoom-in-95">
              <CheckCircle2 className="w-8 h-8 text-[var(--success)] mx-auto" />
              <h3 className="text-sm font-bold text-[var(--text)]">Check your inbox</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                We have dispatched a password reset link to <strong className="text-[var(--text)]">{email}</strong>.
              </p>
              <div className="pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--primary)] hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to sign in</span>
                </Link>
              </div>
            </div>
          ) : (
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

              <button
                type="submit"
                disabled={submitting || loading}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-md flex items-center justify-center gap-2 transition hover:opacity-95 disabled:opacity-50 cursor-pointer"
                style={{
                  backgroundColor: 'var(--primary)',
                  boxShadow: '0 0 16px -2px var(--primary-glow)'
                }}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Sending reset link...</span>
                  </>
                ) : (
                  <span>Send reset link →</span>
                )}
              </button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text)] transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to sign in</span>
                </Link>
              </div>
            </form>
          )}

          <div className="text-center pt-1 text-[11px] text-[var(--text-muted)] flex items-center justify-center gap-1.5 opacity-80 border-t border-[var(--border)]">
            <span>🔒 Authentication powered by Firebase</span>
          </div>
        </div>
      </div>
    </div>
  );
};
