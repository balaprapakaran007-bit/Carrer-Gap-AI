import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle
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
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[var(--background)] text-[var(--text)] transition-colors">
      <div className="w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow */}
        <div 
          className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full blur-3xl opacity-15"
          style={{ backgroundColor: 'var(--primary)' }}
        />

        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div 
            className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            <Compass className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold tracking-tight text-[var(--text)]">
            CareerGap <span style={{ color: 'var(--primary)' }}>AI</span>
          </span>
        </div>

        <div>
          <h1 className="text-xl font-bold text-[var(--text)]">
            Reset your password
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Enter the email address associated with your account and we'll send you a password reset link.
          </p>
        </div>

        {submitted ? (
          <div className="rounded-2xl border border-[var(--success)]/30 bg-[var(--success-soft)] p-5 space-y-3 text-center">
            <CheckCircle2 className="w-8 h-8 text-[var(--success)] mx-auto" />
            <h3 className="text-sm font-bold text-[var(--text)]">Check your inbox</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              We have dispatched a password reset link to <strong className="text-[var(--text)]">{email}</strong>. Follow the link in the email to update your credentials.
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
              <div className="p-3 rounded-xl border border-[var(--danger)]/30 bg-[var(--danger-soft)] text-xs text-[var(--danger)] flex items-center gap-2">
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
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] py-2.5 pl-10 pr-4 text-xs text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || loading}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-md flex items-center justify-center gap-2 transition hover:opacity-95 disabled:opacity-50"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              <span>{submitting ? 'Sending reset link...' : 'Send reset link →'}</span>
            </button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to sign in</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
