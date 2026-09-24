import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { SharedProfilePublicView } from '../types';
import { Compass, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';

export const SharedProfilePage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [profile, setProfile] = useState<SharedProfilePublicView | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchShared = async () => {
      try {
        const data = await api.getPublicProfile(token || 'demo-share-careergap-2026');
        setProfile(data);
      } catch (err: any) {
        setError(err.message || 'This shared profile link has expired or been revoked.');
      } finally {
        setLoading(false);
      }
    };
    fetchShared();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto animate-spin">
            <Sparkles className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-400 font-mono">Loading Verified Candidate Profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-4">
        <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/60 max-w-md text-center space-y-4">
          <h3 className="text-lg font-bold text-white">Profile Unavailable</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {error || 'This shared profile link has been revoked by the candidate.'}
          </p>
          <Link to="/" className="inline-block px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold">
            Go to CareerGap AI
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-blue-500 selection:text-white">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-96 bg-blue-600/10 blur-3xl pointer-events-none" />

      {/* Main Profile Card */}
      <div className="w-full max-w-xl p-8 rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl shadow-2xl space-y-8 relative z-10">
        
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-sm text-slate-100">CareerGap<span className="text-blue-400"> AI</span></span>
          </Link>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>AI Verified Readiness</span>
          </div>
        </div>

        {/* Role & Score */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-slate-400">Candidate Readiness Card</span>
            <h2 className="text-2xl font-black text-white mt-0.5">{profile.roleTitle}</h2>
            <p className="text-xs text-slate-400">Target Role: {profile.jobCompany}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center shrink-0">
            <span className="text-3xl font-black text-blue-400">{profile.readinessScore}%</span>
            <span className="block text-[10px] text-slate-500 uppercase font-bold mt-0.5">Job Match</span>
          </div>
        </div>

        {/* AI Strength Summary */}
        <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/20 space-y-1.5 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Evaluated Strengths</span>
          </span>
          <p className="text-slate-200 leading-relaxed font-medium">
            {profile.aiStrengthSummary}
          </p>
        </div>

        {/* Top Matched Competencies */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Verified Technical Strengths
          </h4>
          <div className="flex flex-wrap gap-2">
            {profile.topMatchedSkills.map((sk, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-950 border border-slate-800 text-slate-200"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {sk}
              </span>
            ))}
          </div>
        </div>

        {/* Footer info & CTA */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>Shared securely with CareerGap AI • Privacy Protected</span>
          <Link
            to="/analyze"
            className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition"
          >
            <span>Analyze Your Own Resume</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
