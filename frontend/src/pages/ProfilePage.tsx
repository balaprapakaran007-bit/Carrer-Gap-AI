import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../context/DashboardContext';
import {
  User,
  Award,
  Flame,
  Zap,
  Share2,
  Download,
  CheckCircle2,
  Sparkles,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Compass,
  FileCheck
} from 'lucide-react';

interface BadgeItem {
  id: string;
  name: string;
  category: string;
  earnedDate: string;
  description: string;
  xp: number;
  iconColor: string;
}

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { isDemoMode } = useDashboard();
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const badges: BadgeItem[] = [
    {
      id: 'badge-python',
      name: 'Python Ready',
      category: 'Core Language',
      earnedDate: 'Sep 12, 2026',
      description: 'Verified advanced proficiency in modern Python 3.12, async patterns, and data engineering structures.',
      xp: 150,
      iconColor: '#3B82F6',
    },
    {
      id: 'badge-rag',
      name: 'RAG Architecture Specialist',
      category: 'AI / Vector DB',
      earnedDate: 'Sep 18, 2026',
      description: 'Demonstrated end-to-end vector embeddings, hybrid semantic retrieval, and LLM orchestration pipeline construction.',
      xp: 250,
      iconColor: '#8B5CF6',
    },
    {
      id: 'badge-sql',
      name: 'SQL Query Architect',
      category: 'Database / Analytics',
      earnedDate: 'Sep 05, 2026',
      description: 'Mastery in complex analytical window queries, CTEs, query plan optimization, and schema design.',
      xp: 120,
      iconColor: '#10B981',
    },
    {
      id: 'badge-streak',
      name: '5-Day Momentum Streak',
      category: 'Consistency',
      earnedDate: 'Sep 24, 2026',
      description: 'Maintained consecutive daily active learning and milestone progress in target career roadmaps.',
      xp: 100,
      iconColor: '#F59E0B',
    },
  ];

  const handleShareBadge = (badge: BadgeItem) => {
    setSelectedBadge(badge);
    navigator.clipboard.writeText(
      `https://careergap.ai/badges/verify/${badge.id}?user=${encodeURIComponent(user?.name || 'Alex Chen')}`
    );
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header Profile Summary */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.name}
                className="w-16 h-16 rounded-2xl border-2 border-[var(--border-strong)] object-cover shadow-sm"
              />
            ) : (
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-md"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[var(--text-main)]">
                  {user?.name || 'Alex Chen'}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3" /> Verified Candidate
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {user?.email || 'alex.chen@example.com'} • Targeting: Machine Learning Engineer & AI Architect
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-[var(--text-muted)]">
                <span className="flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-[var(--primary)]" />
                  Primary Role: <strong>Machine Learning Engineer</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Latest Resume: <strong>Alex_Chen_MLE_2026.pdf</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Gamification Stats */}
          <div className="flex items-center gap-3 bg-[var(--bg-card)] p-3 rounded-xl border border-[var(--border-subtle)] w-full sm:w-auto justify-around">
            <div className="text-center px-3">
              <div className="flex items-center justify-center gap-1 text-amber-400 text-sm font-bold">
                <Flame className="w-4 h-4 fill-amber-400" />
                <span>5 Days</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Streak</span>
            </div>
            <div className="h-8 w-px bg-[var(--border-subtle)]" />
            <div className="text-center px-3">
              <div className="flex items-center justify-center gap-1 text-[var(--primary)] text-sm font-bold">
                <Zap className="w-4 h-4" />
                <span>620 XP</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Career XP</span>
            </div>
            <div className="h-8 w-px bg-[var(--border-subtle)]" />
            <div className="text-center px-3">
              <div className="flex items-center justify-center gap-1 text-emerald-400 text-sm font-bold">
                <Award className="w-4 h-4" />
                <span>4</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Badges</span>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Showcase (17A) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[var(--primary)]" />
              <h2 className="text-base font-bold text-[var(--text-main)]">Earned Skill Badges & Credentials</h2>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Verified badges earned through evidence validation and roadmap milestones. Share directly to LinkedIn.
            </p>
          </div>
          {copiedLink && (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verification link copied!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-sm transition-all hover:border-[var(--border-strong)] hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm"
                    style={{ backgroundColor: badge.iconColor }}
                  >
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--primary-muted)] text-[var(--primary)] border border-[var(--primary)]/20">
                    +{badge.xp} XP
                  </span>
                </div>

                <h3 className="text-xs font-bold text-[var(--text-main)]">{badge.name}</h3>
                <span className="text-[10px] text-[var(--text-muted)] font-medium block">{badge.category}</span>
                <p className="text-[11px] text-[var(--text-muted)] mt-2 leading-relaxed">
                  {badge.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
                <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {badge.earnedDate}
                </span>
                <button
                  onClick={() => handleShareBadge(badge)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--primary)] hover:underline"
                  title="Share badge verification"
                >
                  <Share2 className="w-3 h-3" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shareable Public Profile Card (Section 30) */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[var(--text-main)]">
              Shareable Verified Career Snapshot
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Generate a sanitized, read-only proof card for recruiters, hiring managers, and your LinkedIn profile.
            </p>
          </div>

          <a
            href="/share/demo-share-careergap-2026"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-sm transition hover:opacity-90 shrink-0"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            <span>View Public Proof Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
