import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import {
  Upload, FileText, Globe, Sparkles, Check, Loader2,
  AlertCircle, CheckCircle2, RefreshCw, ChevronDown, Clock, ShieldCheck, Briefcase
} from 'lucide-react';

interface SampleJob {
  id: string;
  title: string;
  company: string;
  badge: string;
  description: string;
}

const SAMPLE_JOBS: SampleJob[] = [
  {
    id: 'sample-ml-engineer',
    title: 'Machine Learning Engineer',
    company: 'AI Nexus Corp',
    badge: 'ML & PyTorch',
    description: `Role: Machine Learning Engineer
Company: AI Nexus Corp

We are seeking a Machine Learning Engineer to build, evaluate, and scale predictive intelligence and GenAI models for enterprise clients. In this role, you will design transformer architectures, optimize inference latency with PyTorch, and expose high-throughput endpoints using FastAPI. You will work closely with database architects to write complex SQL aggregations on PostgreSQL and orchestrate containerized microservices using Docker. Experience deploying on AWS and implementing Retrieval Augmented Generation (RAG) pipelines is highly valued. Solid system design principles and distributed system knowledge are required.`
  },
  {
    id: 'sample-ai-platform',
    title: 'AI Platform Engineer',
    company: 'Cortex Distributed Systems',
    badge: 'Docker & Kubernetes',
    description: `Role: AI Platform Engineer
Company: Cortex Distributed Systems

Cortex is looking for an AI Platform Engineer to build scalable runtime infrastructure for deploying and monitoring production LLM models. You will be responsible for creating robust containerized workloads with Docker and managing multi-node Kubernetes clusters. You will implement automated CI/CD pipelines to ensure seamless zero-downtime rollouts and develop high-concurrency microservices with Python and FastAPI. The role involves configuring low-latency Redis caching layers, setting up Prometheus metric collection, and designing resilient distributed microservices architectures.`
  },
  {
    id: 'sample-python-backend',
    title: 'Senior Python Backend Developer',
    company: 'FinScale Technologies',
    badge: 'Postgres & AWS',
    description: `Role: Senior Python Backend Developer
Company: FinScale Technologies

FinScale is hiring a Senior Python Backend Developer to engineer high-volume transactional financial APIs and data persistence services. You will design scalable database schemas with PostgreSQL, optimize complex queries, and build modular RESTful microservices using FastAPI and Python. You will containerize applications using Docker and deploy cloud infrastructure on AWS. Strong adherence to test-driven development with automated unit testing, robust system design patterns, and clean architectural documentation is required.`
  }
];

export const AnalyzePage: React.FC = () => {
  const navigate = useNavigate();

  // Resume State
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [resumeUploaded, setResumeUploaded] = useState<boolean>(false);
  const [resumeFileName, setResumeFileName] = useState<string>('');

  // Job Description State
  const [jobInputMode, setJobInputMode] = useState<'paste' | 'upload' | 'url'>('paste');
  const [jobTitle, setJobTitle] = useState<string>('Machine Learning Engineer');
  const [jobCompany, setJobCompany] = useState<string>('AI Nexus Corp');
  const [jobText, setJobText] = useState<string>(SAMPLE_JOBS[0].description);
  const [selectedSampleBadge, setSelectedSampleBadge] = useState<string>('Sample: Machine Learning Engineer');
  
  const [showSampleDropdown, setShowSampleDropdown] = useState<boolean>(false);
  const [jobUrl, setJobUrl] = useState<string>('');
  const [isFetchingUrl, setIsFetchingUrl] = useState<boolean>(false);

  // Analysis Processing State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [currentStageMessage, setCurrentStageMessage] = useState<string>('Initializing analysis pipeline...');
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const timerRef = useRef<any>(null);

  const PIPELINE_STAGES = [
    { key: 'resume_parsed', label: 'Resume parsed & competencies detected' },
    { key: 'requirements_extracted', label: 'Job requirements & priority levels extracted' },
    { key: 'comparing_skills', label: 'Comparing skills & computing readiness scores' },
    { key: 'checking_evidence', label: 'Verifying evidence strength & citations' },
    { key: 'generating_roadmap', label: 'Generating personalized roadmap & project plans' }
  ];

  useEffect(() => {
    if (isAnalyzing) {
      setElapsedSeconds(0);
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAnalyzing]);

  // Handle Resume File Pick
  const handleResumeFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFile(file);
      setResumeFileName(file.name);

      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await api.uploadResume(formData);
        setResumeText(res.extractedText);
        setResumeUploaded(true);
      } catch (err: any) {
        setErrorMsg(err.message || 'Error parsing PDF resume');
      }
    }
  };

  // Load Preset Demo Resume
  const handleLoadDemoResume = () => {
    setResumeFileName('Alex_Chen_ML_Resume.pdf');
    setResumeUploaded(true);
    setResumeText(`ALEX CHEN | Machine Learning Engineer
San Francisco, CA | alex.chen@example.com

SUMMARY:
Machine Learning Engineer with 2+ years of experience building predictive models, fine-tuning open-source LLMs, and deploying analytical data pipelines. Strong foundation in Python, PyTorch, SQL, and Machine Learning algorithms.

EXPERIENCE:
Associate Machine Learning Engineer | DataPulse Labs (2024 - Present)
- Developed and trained a transformer-based text classification model using PyTorch and HuggingFace, improving document tagging precision by 18%.
- Engineered ETL data pipelines in Python and PostgreSQL to process 500,000+ records daily with automated data quality validations.

Data Science Intern | Apex Analytics (2024)
- Built customer churn prediction models using Scikit-Learn and XGBoost, achieving 0.84 ROC-AUC.
- Analyzed large relational databases with complex SQL window functions.

PROJECTS:
Semantic Search & Question Answering Engine
- Implemented semantic document search using dense vector embeddings and cosine similarity.

SKILLS: Python, PyTorch, SQL, PostgreSQL, Machine Learning, Deep Learning, NLP, Pandas, Scikit-Learn, Git. Basic: Docker, AWS, FastAPI.`);
  };

  // Select Sample Job
  const handleSelectSampleJob = (sample: SampleJob) => {
    setJobTitle(sample.title);
    setJobCompany(sample.company);
    setJobText(sample.description);
    setSelectedSampleBadge(`Sample: ${sample.title}`);
    setShowSampleDropdown(false);
  };

  // Handle URL Fetch
  const handleFetchUrl = async () => {
    if (!jobUrl) return;
    setIsFetchingUrl(true);
    setErrorMsg('');
    try {
      const res = await api.fetchJobFromUrl(jobUrl);
      setJobText(res.extractedText);
      if (res.title) setJobTitle(res.title);
      setSelectedSampleBadge('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to extract job posting from URL. Please paste the job description text.');
    } finally {
      setIsFetchingUrl(false);
    }
  };

  // Start Analysis with Real-Time Staged SSE Streaming
  const handleRunAnalysis = async () => {
    if (!resumeText && !resumeUploaded) {
      setErrorMsg('Please upload a resume or use the demo resume.');
      return;
    }
    if (!jobText.trim()) {
      setErrorMsg('Please provide a job description.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg('');
    setCurrentStageIndex(0);
    setCurrentStageMessage('Reading and parsing candidate resume...');

    try {
      const result = await api.createAnalysisStream(
        {
          resumeText: resumeText || 'Demo ML candidate resume with Python, PyTorch, SQL.',
          resumeFileName: resumeFileName || 'Candidate_Resume.pdf',
          jobText: jobText,
          jobTitle: jobTitle,
          jobCompany: jobCompany
        },
        (stageUpdate) => {
          setCurrentStageIndex(stageUpdate.step);
          setCurrentStageMessage(stageUpdate.message);
        }
      );

      setTimeout(() => {
        navigate(`/analysis/${result.id}`);
      }, 400);
    } catch (err: any) {
      setIsAnalyzing(false);
      setErrorMsg(err.message || 'Analysis failed. Please check inputs and try again.');
    }
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}s`;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 selection:bg-[#FFF3E8] selection:text-[#F97316] bg-white">
      
      {/* Header */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#F97316]">Analysis Engine</span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#1C1917] mt-0.5">
          AI Career Gap & Compatibility Analysis
        </h1>
        <p className="text-xs text-[#78716C] mt-1">
          Upload your resume and select a target job to discover exact skill gaps, evidence strength, and your personalized roadmap.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-[#FEE2E2] border border-[#DC2626]/20 text-xs text-[#DC2626] flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN: Resume Ingestion */}
        <div className="p-6 rounded-3xl border border-[#E7E5E4] bg-white shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E5E4]">
              <h3 className="text-sm font-bold text-[#1C1917] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#F97316]" />
                <span>1. Candidate Resume</span>
              </h3>
              <button
                type="button"
                onClick={handleLoadDemoResume}
                className="text-xs font-semibold text-[#F97316] hover:text-[#EA580C] transition cursor-pointer"
              >
                Use Demo ML Resume
              </button>
            </div>

            {/* Upload Area */}
            <div className="relative border-2 border-dashed border-[#E7E5E4] hover:border-[#F97316] rounded-2xl p-8 text-center transition bg-[#FAFAFA] group">
              <input
                type="file"
                accept=".pdf,.txt,.docx"
                onChange={handleResumeFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              <div className="space-y-3 pointer-events-none">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF3E8] border border-[#F97316]/20 flex items-center justify-center text-[#F97316] mx-auto group-hover:scale-105 transition">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1C1917]">
                    {resumeFileName ? resumeFileName : 'Drop your PDF Resume here or click to browse'}
                  </p>
                  <p className="text-[11px] text-[#78716C] mt-1">Supports text-based PDF, DOCX, TXT</p>
                </div>
              </div>
            </div>

            {/* Upload Confirmation */}
            {resumeUploaded && (
              <div className="p-3.5 rounded-xl bg-[#DCFCE7] border border-[#16A34A]/20 flex items-center justify-between text-xs text-[#16A34A]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                  <span className="font-semibold">{resumeFileName || 'Resume.pdf'} Ready for Analysis</span>
                </div>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded text-[#16A34A] font-bold border border-[#16A34A]/20">
                  Parsed ✓
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#78716C] pt-2 border-t border-[#E7E5E4]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Resumes are parsed securely for candidate benchmarking.</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Job Description Input */}
        <div className="p-6 rounded-3xl border border-[#E7E5E4] bg-white shadow-sm space-y-6">
          <div className="space-y-4">
            
            {/* Header with Sample Job Selector */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E7E5E4]">
              <h3 className="text-sm font-bold text-[#1C1917] flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#F97316]" />
                <span>2. Target Job Description</span>
              </h3>

              {/* Sample Job Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowSampleDropdown(!showSampleDropdown)}
                  className="px-3 py-1 rounded-xl text-xs font-bold text-[#F97316] bg-[#FFF3E8] border border-[#F97316]/30 hover:bg-[#F97316] hover:text-white transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Try a sample job ▾</span>
                </button>

                {showSampleDropdown && (
                  <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-[#E7E5E4] bg-white p-2 shadow-xl z-30 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                    <div className="px-3 py-1 text-[10px] font-bold text-[#78716C] uppercase tracking-wider">
                      Preset Job Roles
                    </div>
                    {SAMPLE_JOBS.map((sample) => (
                      <button
                        key={sample.id}
                        type="button"
                        onClick={() => handleSelectSampleJob(sample)}
                        className="w-full p-2.5 rounded-xl text-left hover:bg-[#FAFAFA] border border-transparent hover:border-[#E7E5E4] transition cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#1C1917]">{sample.title}</span>
                          <span className="text-[10px] font-semibold text-[#F97316] bg-[#FFF3E8] px-1.5 py-0.5 rounded">
                            {sample.badge}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#78716C] block">{sample.company}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Inputs: Role Title & Company */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-[#78716C] block mb-1">Target Role Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => {
                    setJobTitle(e.target.value);
                    setSelectedSampleBadge('');
                  }}
                  placeholder="e.g. Machine Learning Engineer"
                  className="w-full px-3 py-2 rounded-xl bg-[#FAFAFA] border border-[#E7E5E4] text-xs text-[#1C1917] focus:outline-none focus:border-[#F97316] focus:bg-white transition"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#78716C] block mb-1">Target Company</label>
                <input
                  type="text"
                  value={jobCompany}
                  onChange={(e) => {
                    setJobCompany(e.target.value);
                    setSelectedSampleBadge('');
                  }}
                  placeholder="e.g. AI Nexus Corp"
                  className="w-full px-3 py-2 rounded-xl bg-[#FAFAFA] border border-[#E7E5E4] text-xs text-[#1C1917] focus:outline-none focus:border-[#F97316] focus:bg-white transition"
                />
              </div>
            </div>

            {/* Sample Indicator Badge */}
            {selectedSampleBadge && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAFAFA] border border-[#E7E5E4] text-[11px] font-medium text-[#78716C]">
                <Check className="w-3 h-3 text-[#16A34A]" />
                <span>{selectedSampleBadge}</span>
              </div>
            )}

            {/* Job Description Textarea */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[#78716C] block">Job Requirements & Responsibilities</label>
              <textarea
                rows={9}
                value={jobText}
                onChange={(e) => {
                  setJobText(e.target.value);
                  setSelectedSampleBadge('');
                }}
                placeholder="Paste the full job posting requirements and responsibilities..."
                className="w-full p-3.5 rounded-xl bg-[#FAFAFA] border border-[#E7E5E4] text-xs text-[#1C1917] font-mono focus:outline-none focus:border-[#F97316] focus:bg-white transition leading-relaxed"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Trigger Button or Staged Progress Experience */}
      <div className="pt-4">
        {isAnalyzing ? (
          <div className="p-8 rounded-3xl border border-[#E7E5E4] bg-white max-w-xl mx-auto space-y-6 text-center shadow-lg">
            
            {/* Spinner & Timer */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF3E8] border border-[#F97316]/20 flex items-center justify-center text-[#F97316] mx-auto shadow-sm">
                <Sparkles className="w-6 h-6 animate-spin" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1C1917]">Running Career Gap Analysis</h3>
                <div className="flex items-center justify-center gap-1.5 text-xs text-[#78716C] font-mono mt-1">
                  <Clock className="w-3.5 h-3.5 text-[#F97316]" />
                  <span>Elapsed: {formatTimer(elapsedSeconds)}</span>
                </div>
              </div>
            </div>

            {/* Staged Checklist */}
            <div className="space-y-3 text-left text-xs max-w-md mx-auto pt-4 border-t border-[#E7E5E4]">
              {PIPELINE_STAGES.map((stg, idx) => {
                const stepNum = idx + 1;
                const isCompleted = currentStageIndex >= stepNum;
                const isCurrent = currentStageIndex === idx;

                return (
                  <div key={stg.key} className="flex items-center gap-3">
                    {isCompleted ? (
                      <Check className="w-4 h-4 text-[#16A34A] shrink-0" />
                    ) : isCurrent ? (
                      <RefreshCw className="w-4 h-4 text-[#F97316] animate-spin shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-[#E7E5E4] shrink-0" />
                    )}
                    <span className={isCompleted ? 'text-[#1C1917] font-semibold' : isCurrent ? 'text-[#F97316] font-bold' : 'text-[#78716C]'}>
                      {stg.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* 15s Reassurance Note */}
            {elapsedSeconds >= 15 && (
              <p className="text-[11px] text-[#78716C] bg-[#FAFAFA] p-3 rounded-xl border border-[#E7E5E4] animate-in fade-in">
                💡 Complex resumes and extensive job descriptions can take up to a minute.
              </p>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={handleRunAnalysis}
            className="w-full py-4 rounded-2xl bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-bold shadow-md shadow-[#F97316]/25 flex items-center justify-center gap-2.5 transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 fill-white" />
            <span>Analyze Compatibility & Generate Actionable Roadmap</span>
          </button>
        )}
      </div>
    </div>
  );
};
