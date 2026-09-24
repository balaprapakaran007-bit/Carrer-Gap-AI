import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { SharedProfilePublicView } from '../types';
import { Compass, Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

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
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FFF3E8] border border-[#F97316]/20 flex items-center justify-center text-[#F97316] mx-auto animate-spin">
            <Sparkles className="w-5 h-5 fill-[#F97316]" />
          </div>
          <p className="text-xs text-[#78716C] font-mono">Loading Verified Candidate Profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
        <div className="p-8 rounded-3xl border border-[#E7E5E4] bg-white max-w-md text-center space-y-4 shadow-sm">
          <h3 className="text-lg font-bold text-[#1C1917]">Profile Unavailable</h3>
          <p className="text-xs text-[#78716C] leading-relaxed">
            {error || 'This shared profile link has been revoked by the candidate.'}
          </p>
          <Link to="/" className="inline-block px-5 py-2.5 rounded-xl bg-[#F97316] text-white text-xs font-bold shadow-sm">
            Go to CareerGap AI
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1C1917] flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-[#F97316] selection:text-white">
      
      {/* Main Profile Card */}
      <div className="w-full max-w-xl p-8 rounded-3xl border border-[#E7E5E4] bg-white shadow-xl space-y-8 relative z-10">
        
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[#E7E5E4]">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-[#F97316] flex items-center justify-center shadow-sm">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-sm text-[#1C1917]">CareerGap <span className="text-[#F97316]">AI</span></span>
          </Link>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DCFCE7] border border-[#16A34A]/20 text-[#16A34A] text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>AI Verified Readiness</span>
          </div>
        </div>

        {/* Role & Score */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-[#78716C]">Candidate Readiness Card</span>
            <h2 className="text-2xl font-black text-[#1C1917] mt-0.5">{profile.roleTitle}</h2>
            <p className="text-xs text-[#78716C]">Target Role: {profile.jobCompany}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-[#E7E5E4] text-center shrink-0">
            <span className="text-3xl font-black text-[#F97316]">{profile.readinessScore}%</span>
            <span className="block text-[10px] text-[#78716C] uppercase font-bold mt-0.5">Job Match</span>
          </div>
        </div>

        {/* AI Strength Summary */}
        <div className="p-4 rounded-2xl bg-[#FFF3E8] border border-[#F97316]/20 space-y-1.5 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#F97316] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 fill-[#F97316]" />
            <span>AI Evaluated Strengths</span>
          </span>
          <p className="text-[#1C1917] leading-relaxed font-medium">
            "{profile.aiStrengthSummary || 'Demonstrates solid alignment with core engineering requirements.'}"
          </p>
        </div>

        {/* Top Verified Skills */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#78716C]">
            Verified Competencies & Evidence
          </h4>
          <div className="flex flex-wrap gap-2">
            {(profile.topMatchedSkills || profile.topStrengths || []).map((sk: string, i: number) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#DCFCE7] text-[#16A34A] border border-[#16A34A]/20"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{sk}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Action Prompt */}
        <div className="pt-4 border-t border-[#E7E5E4] flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-[#78716C]">
            Powered by CareerGap AI Intelligence Engine
          </span>
          <Link
            to="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <span>Analyze Your Own Resume</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
