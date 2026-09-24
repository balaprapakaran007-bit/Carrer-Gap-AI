import React, { useState } from 'react';
import { api } from '../services/api';
import { Layers, Sparkles, Plus, Trash2, ArrowRight, CheckCircle2, AlertTriangle, Zap } from 'lucide-react';

export const MultiComparePage: React.FC = () => {
  const [jobs, setJobs] = useState<Array<{ id: string; title: string; description: string }>>([
    {
      id: '1',
      title: 'Machine Learning Engineer',
      description: 'Requirements: Python, SQL, PyTorch, Docker, FastAPI, RAG, AWS, System Design.'
    },
    {
      id: '2',
      title: 'AI Platform Engineer',
      description: 'Requirements: Python, Docker, Kubernetes, CI/CD, FastAPI, Redis, Microservices.'
    },
    {
      id: '3',
      title: 'Senior Python Backend Developer',
      description: 'Requirements: Python, PostgreSQL, Docker, FastAPI, AWS, System Design, Unit Testing.'
    }
  ]);

  const [compareResult, setCompareResult] = useState<any>({
    commonSkills: ['Python', 'SQL', 'Machine Learning', 'Git'],
    commonGaps: ['Docker', 'FastAPI', 'AWS'],
    roleSpecificGaps: {
      'Machine Learning Engineer': ['RAG', 'PyTorch Optimization'],
      'AI Platform Engineer': ['Kubernetes', 'CI/CD Pipelines'],
      'Senior Python Backend Developer': ['PostgreSQL Tuning', 'System Design']
    },
    highestLeverageSkills: [
      {
        skill: 'Docker',
        unblocksJobsCount: 3,
        totalJobs: 3,
        recommendation: 'Learning Docker would move you closer to readiness across all 3 of your tracked opportunities.'
      },
      {
        skill: 'FastAPI',
        unblocksJobsCount: 3,
        totalJobs: 3,
        recommendation: 'Learning FastAPI closes backend API gaps in 3 tracked jobs.'
      },
      {
        skill: 'AWS',
        unblocksJobsCount: 2,
        totalJobs: 3,
        recommendation: 'Cloud deployment closes infrastructure requirements across 2 tracked jobs.'
      }
    ]
  });

  const [isComparing, setIsComparing] = useState(false);

  const handleAddJob = () => {
    setJobs((prev) => [
      ...prev,
      { id: String(Date.now()), title: `Target Role ${prev.length + 1}`, description: '' }
    ]);
  };

  const handleRemoveJob = (id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
  };

  const handleRunCompare = async () => {
    setIsComparing(true);
    try {
      const res = await api.compareMultipleJobs({
        resumeText: 'Python, PyTorch, SQL, PostgreSQL, Machine Learning, Deep Learning, Pandas, Scikit-Learn.',
        jobDescriptions: jobs
      });
      setCompareResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 selection:bg-blue-500 selection:text-white">
      
      {/* Header */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">Multi-Role Strategy</span>
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5 mt-0.5">
          <Layers className="w-6 h-6 text-blue-400" />
          <span>Multi-Job Compatibility Comparison</span>
        </h1>
        <p className="text-xs text-slate-400">
          Compare multiple job opportunities simultaneously to find cross-role commonalities and identify highest-leverage skills to learn next.
        </p>
      </div>

      {/* Input Jobs Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Tracked Job Openings ({jobs.length})</h3>
          <button
            onClick={handleAddJob}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-blue-400 flex items-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Another Job</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {jobs.map((job, idx) => (
            <div key={job.id} className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md space-y-3">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={job.title}
                  onChange={(e) => {
                    const next = [...jobs];
                    next[idx].title = e.target.value;
                    setJobs(next);
                  }}
                  className="font-bold text-sm text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-blue-500 focus:outline-none w-full mr-2"
                />
                {jobs.length > 2 && (
                  <button
                    onClick={() => handleRemoveJob(job.id)}
                    className="p-1 rounded text-slate-500 hover:text-red-400 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <textarea
                rows={4}
                value={job.description}
                onChange={(e) => {
                  const next = [...jobs];
                  next[idx].description = e.target.value;
                  setJobs(next);
                }}
                placeholder="Paste job requirements..."
                className="w-full p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleRunCompare}
            disabled={isComparing}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isComparing ? 'Comparing Roles...' : 'Analyze Cross-Job Commonalities'}</span>
          </button>
        </div>
      </div>

      {/* Results Section */}
      {compareResult && (
        <div className="space-y-6 pt-4 border-t border-slate-800">
          
          {/* Highest-Leverage Skill Callout */}
          {compareResult.highestLeverageSkills && compareResult.highestLeverageSkills.length > 0 && (
            <div className="p-6 rounded-3xl border border-blue-500/30 bg-gradient-to-r from-blue-950/30 via-slate-900/80 to-slate-900/80 backdrop-blur-xl space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
                <h3 className="text-base font-bold text-white">Highest-Leverage Skills to Learn Next</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {compareResult.highestLeverageSkills.map((lev: any, i: number) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-blue-400">{lev.skill}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300">
                        Unblocks {lev.unblocksJobsCount} of {lev.totalJobs} Jobs
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{lev.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Common Skills Card */}
            <div className="p-6 rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Universal Strengths Across All Roles</h3>
              </div>
              <p className="text-xs text-slate-400">
                Skills you already possess that qualify you across all analyzed jobs.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {compareResult.commonSkills.map((s: string, idx: number) => (
                  <span key={idx} className="px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Common Gaps Card */}
            <div className="p-6 rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <h3 className="text-sm font-bold text-white">Common Missing Requirements</h3>
              </div>
              <p className="text-xs text-slate-400">
                Skills missing in 2 or more of your target job descriptions.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {compareResult.commonGaps.map((s: string, idx: number) => (
                  <span key={idx} className="px-3 py-1 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    • {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
