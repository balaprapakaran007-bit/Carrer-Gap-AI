import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Compass, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, MapPin,
  Mic, BarChart3, Layers, Award, Flame, Zap, Target, HelpCircle, FileText
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { loginDemoUser } = useAuth();
  const navigate = useNavigate();

  const handleDemoLaunch = () => {
    loginDemoUser();
    navigate('/analysis/demo-analysis-ml-01');
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-blue-500 selection:text-white">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-600/15 via-indigo-600/5 to-transparent blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto space-y-8">
        
        {/* Tagline Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation AI Career Fit & Skill-Gap Engine</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
          Don't just know your match.<br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Know your next move.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          Legacy ATS scorers give you a score and leave you guessing. CareerGap AI explains your exact skill and evidence gaps, designs portfolio projects to close them, and coaches you step-by-step until you're job ready.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/analyze"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2.5 transition transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Analyze My Resume</span>
          </Link>

          <button
            onClick={handleDemoLaunch}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 text-sm font-bold flex items-center justify-center gap-2 transition"
          >
            <span>Try Live Demo Analysis</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Live Match Preview Card */}
        <div className="pt-12">
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-xl shadow-2xl max-w-3xl mx-auto text-left space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                  ML
                </div>
                <div>
                  <h4 className="font-bold text-slate-100 text-sm">Machine Learning Engineer</h4>
                  <p className="text-xs text-slate-400">Target Role Match & Gap Breakdown</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Job Readiness</span>
                  <div className="text-2xl font-black text-blue-400">78%</div>
                </div>
              </div>
            </div>

            {/* Micro Skill Matrix Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">Python</span>
                  <span className="text-emerald-400 font-bold text-[11px]">Matched</span>
                </div>
                <p className="text-[11px] text-slate-400 italic">"Developed ML pipeline..."</p>
                <span className="text-[10px] text-slate-500 font-semibold">Evidence: Strong</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">Docker</span>
                  <span className="text-rose-400 font-bold text-[11px]">Missing</span>
                </div>
                <p className="text-[11px] text-slate-400">Required in JD, not in resume</p>
                <span className="text-[10px] text-blue-400 font-semibold">→ Project Solution Generated</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">AWS</span>
                  <span className="text-amber-400 font-bold text-[11px]">Weak Evidence</span>
                </div>
                <p className="text-[11px] text-slate-400">Listed only without project</p>
                <span className="text-[10px] text-amber-400 font-semibold">→ Quantify Scale</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-800/80 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Engine Architecture</span>
          <h2 className="text-3xl font-bold text-white">How CareerGap AI Transforms Your Profile</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            From semantic requirement extraction to mock interview coaching.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-md space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-100 text-sm">1. Semantic Ingestion</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Extracts competencies from your PDF resume and parses job descriptions via paste or direct URL import.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-md space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-100 text-sm">2. Evidence Verification</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Evaluates whether each skill is strongly demonstrated, moderate, or merely listed as a weak buzzword.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-md space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-100 text-sm">3. Actionable Roadmap</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generates multi-skill portfolio projects and milestone roadmaps with verified learning resource attachments.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-md space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Mic className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-100 text-sm">4. Interview Simulation</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Practice role-specific and gap-probing interview questions with automated AI rubric scoring and feedback.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table: ATS Scorer vs CareerGap AI */}
      <section id="comparison" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-slate-800/80 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">The Differentiation</span>
          <h2 className="text-3xl font-bold text-white">Why Legacy ATS Resume Scorers Fail</h2>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-md overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400">
                <th className="py-4 px-6">Capability</th>
                <th className="py-4 px-6 text-slate-500">Legacy ATS Scorers</th>
                <th className="py-4 px-6 text-blue-400 font-bold">CareerGap AI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr>
                <td className="py-4 px-6 font-semibold text-slate-200">Matching Logic</td>
                <td className="py-4 px-6 text-slate-400">Brittle keyword counting</td>
                <td className="py-4 px-6 text-emerald-400 font-semibold">Semantic embeddings + Taxonomy normalization</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-semibold text-slate-200">Evidence Depth</td>
                <td className="py-4 px-6 text-slate-400">Treats buzzword list same as real project</td>
                <td className="py-4 px-6 text-emerald-400 font-semibold">Distinguishes Strong vs Weak evidence with citations</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-semibold text-slate-200">Missing Skill Action</td>
                <td className="py-4 px-6 text-slate-400">Tells you to stuff keywords in resume</td>
                <td className="py-4 px-6 text-emerald-400 font-semibold">Architects full portfolio projects & learning roadmaps</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-semibold text-slate-200">Interview Prep</td>
                <td className="py-4 px-6 text-slate-400">None</td>
                <td className="py-4 px-6 text-emerald-400 font-semibold">Role-tailored mock interview simulator with rubric scoring</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-semibold text-slate-200">Peer Benchmarks</td>
                <td className="py-4 px-6 text-slate-400">Arbitrary black-box percentile</td>
                <td className="py-4 px-6 text-emerald-400 font-semibold">Anonymized skill-by-skill role comparisons</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-slate-800/80 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-black text-white">
          Ready to bridge the gap to your target role?
        </h2>
        <p className="text-sm text-slate-300 max-w-xl mx-auto">
          Upload your resume and target job posting to receive your explainable breakdown and roadmap in seconds.
        </p>
        <div className="pt-4 flex justify-center">
          <Link
            to="/analyze"
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold shadow-xl shadow-blue-500/25 flex items-center gap-2 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start Free Analysis</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-slate-800/80 text-center text-xs text-slate-500">
        <p>© 2026 CareerGap AI — Built for PS-93 AI Career Fit & Skill-Gap Engine</p>
      </footer>
    </div>
  );
};
