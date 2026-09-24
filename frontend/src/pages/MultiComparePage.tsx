import React, { useState } from 'react';
import { api } from '../services/api';
import { Layers, Sparkles, Plus, Trash2, ArrowRight, CheckCircle2, AlertTriangle, Zap, Check, X } from 'lucide-react';

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
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 selection:bg-[#F97316] selection:text-white bg-white">
      
      {/* Header */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#F97316]">Multi-Role Strategy</span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#1C1917] flex items-center gap-2.5 mt-0.5">
          <Layers className="w-6 h-6 text-[#F97316]" />
          <span>Multi-Job Compatibility Comparison</span>
        </h1>
        <p className="text-xs text-[#78716C] mt-1">
          Compare multiple job opportunities simultaneously to find cross-role commonalities and identify highest-leverage skills to learn next.
        </p>
      </div>

      {/* Input Jobs Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#1C1917]">Tracked Job Openings ({jobs.length})</h3>
          <button
            onClick={handleAddJob}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAFAFA] border border-[#E7E5E4] hover:border-[#F97316] text-xs font-semibold text-[#1C1917] hover:text-[#F97316] flex items-center gap-1.5 transition cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Another Job</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {jobs.map((job, idx) => (
            <div 
              key={job.id} 
              className="p-5 rounded-2xl border border-[#E7E5E4] bg-white shadow-sm space-y-3 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={job.title}
                  onChange={(e) => {
                    const next = [...jobs];
                    next[idx].title = e.target.value;
                    setJobs(next);
                  }}
                  className="font-bold text-sm text-[#1C1917] bg-transparent border-b border-transparent hover:border-[#E7E5E4] focus:border-[#F97316] focus:outline-none w-full mr-2 py-0.5"
                />
                {jobs.length > 2 && (
                  <button
                    onClick={() => handleRemoveJob(job.id)}
                    className="p-1 rounded text-[#78716C] hover:text-[#DC2626] transition cursor-pointer"
                    title="Remove job"
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
                className="w-full p-3 rounded-xl bg-[#FAFAFA] border border-[#E7E5E4] text-xs text-[#1C1917] placeholder-[#78716C] font-mono focus:outline-none focus:border-[#F97316] focus:bg-white transition"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleRunCompare}
            disabled={isComparing}
            className="px-6 py-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold shadow-md shadow-[#F97316]/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 fill-white" />
            <span>{isComparing ? 'Comparing Roles...' : 'Analyze Cross-Job Commonalities'}</span>
          </button>
        </div>
      </div>

      {/* Results Section */}
      {compareResult && (
        <div className="space-y-6 pt-6 border-t border-[#E7E5E4]">
          
          {/* Highest-Leverage Skill Callout */}
          {compareResult.highestLeverageSkills && compareResult.highestLeverageSkills.length > 0 && (
            <div className="p-6 rounded-3xl border border-[#E7E5E4] bg-[#F5F5F4] space-y-4 shadow-sm">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#F97316] fill-[#F97316]" />
                <h3 className="text-base font-bold text-[#1C1917]">Highest-Leverage Skills to Learn Next</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {compareResult.highestLeverageSkills.map((lev: any, i: number) => (
                  <div 
                    key={i} 
                    className="p-4 rounded-2xl bg-white border border-[#E7E5E4] space-y-2 shadow-sm hover:border-[#F97316]/40 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#F97316]">{lev.skill}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF3E8] text-[#F97316] border border-[#F97316]/20">
                        Unblocks {lev.unblocksJobsCount} of {lev.totalJobs} Jobs
                      </span>
                    </div>
                    <p className="text-xs text-[#78716C] leading-relaxed">{lev.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Universal Strengths Card */}
            <div className="p-6 rounded-3xl border border-[#E7E5E4] bg-white shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
                <h3 className="text-sm font-bold text-[#1C1917]">Universal Strengths Across All Roles</h3>
              </div>
              <p className="text-xs text-[#78716C]">
                Skills you already possess that qualify you across all analyzed jobs.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {compareResult.commonSkills.map((s: string, idx: number) => (
                  <span 
                    key={idx} 
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-[#DCFCE7] text-[#16A34A] border border-[#16A34A]/20"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>{s}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Common Missing Requirements Card */}
            <div className="p-6 rounded-3xl border border-[#E7E5E4] bg-white shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#DC2626]" />
                <h3 className="text-sm font-bold text-[#1C1917]">Common Missing Requirements</h3>
              </div>
              <p className="text-xs text-[#78716C]">
                Skills missing in 2 or more of your target job descriptions.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {compareResult.commonGaps.map((s: string, idx: number) => (
                  <span 
                    key={idx} 
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-[#FEE2E2] text-[#DC2626] border border-[#DC2626]/20"
                  >
                    <X className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>{s}</span>
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
