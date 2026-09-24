import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import {
  Upload, FileText, Globe, Sparkles, Check, Loader2, ArrowRight,
  AlertCircle, CheckCircle2, RefreshCw, FileCode
} from 'lucide-react';

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
  const [jobText, setJobText] = useState<string>(`Role: Machine Learning Engineer
Company: AI Nexus Corp

Requirements:
- Critical: 2+ years of production experience in Python and Machine Learning model development
- Critical: Deep proficiency in SQL and relational database modeling (PostgreSQL)
- Critical: Hands-on experience with PyTorch or TensorFlow for deep learning
- High: Experience designing and building RESTful APIs using FastAPI
- High: Proficiency with Docker for containerizing microservices and local development
- High: Familiarity with Retrieval Augmented Generation (RAG) and LLM application frameworks
- Medium: Experience with Cloud infrastructure (AWS / GCP) and CI/CD pipelines
- Medium: Understanding of System Design for scalable distributed services`);
  
  const [jobUrl, setJobUrl] = useState<string>('');
  const [isFetchingUrl, setIsFetchingUrl] = useState<boolean>(false);
  const [urlFetchSuccess, setUrlFetchSuccess] = useState<boolean>(false);

  // Analysis Processing State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const stages = [
    'Reading and parsing candidate resume...',
    'Understanding candidate skills & projects...',
    'Extracting structured job requirements...',
    'Comparing semantic skills & taxonomy...',
    'Verifying evidence strength & citations...',
    'Detecting project gaps & learning resources...',
    'Building personalized career roadmap...'
  ];

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

  // Handle URL Fetch
  const handleFetchUrl = async () => {
    if (!jobUrl) return;
    setIsFetchingUrl(true);
    setErrorMsg('');
    try {
      const res = await api.fetchJobFromUrl(jobUrl);
      setJobText(res.extractedText);
      if (res.title) setJobTitle(res.title);
      setUrlFetchSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to extract job posting from URL. Please paste the job description text.');
    } finally {
      setIsFetchingUrl(false);
    }
  };

  // Start Analysis
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
    setCurrentStage(0);

    // Animation ticker
    const interval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev < stages.length - 1) return prev + 1;
        return prev;
      });
    }, 700);

    try {
      const result = await api.createAnalysis({
        resumeText: resumeText || 'Demo ML candidate resume with Python, PyTorch, SQL.',
        resumeFileName: resumeFileName || 'Candidate_Resume.pdf',
        jobText: jobText,
        jobTitle: jobTitle,
        jobCompany: jobCompany
      });

      clearInterval(interval);
      setTimeout(() => {
        navigate(`/analysis/${result.id}`);
      }, 500);
    } catch (err: any) {
      clearInterval(interval);
      setIsAnalyzing(false);
      setErrorMsg(err.message || 'Analysis failed. Please try again.');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 selection:bg-blue-500 selection:text-white">
      
      {/* Header */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">Analysis Engine</span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
          AI Career Gap & Compatibility Analysis
        </h1>
        <p className="text-xs text-slate-400">
          Upload your resume and input the target job description to discover exact gaps and your custom roadmap.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN: Resume Ingestion */}
        <div className="p-6 rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <span>1. Candidate Resume</span>
              </h3>
              <button
                onClick={handleLoadDemoResume}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition"
              >
                Use Demo ML Resume
              </button>
            </div>

            {/* Upload Area */}
            <div className="relative border-2 border-dashed border-slate-700 hover:border-blue-500/60 rounded-2xl p-8 text-center transition bg-slate-950/40 group">
              <input
                type="file"
                accept=".pdf,.txt,.docx"
                onChange={handleResumeFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              <div className="space-y-3 pointer-events-none">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto group-hover:scale-110 transition">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200">
                    {resumeFileName ? resumeFileName : 'Drop your PDF Resume here or click to browse'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">Supports text-based PDF, DOCX, TXT</p>
                </div>
              </div>
            </div>

            {/* Upload Confirmation */}
            {resumeUploaded && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs text-emerald-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold">{resumeFileName || 'Resume.pdf'} Ready for Analysis</span>
                </div>
                <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-300 font-bold">
                  Parsed ✓
                </span>
              </div>
            )}
          </div>

          <p className="text-[11px] text-slate-500">
            Privacy Guarantee: Resumes are analyzed securely and never shared with third parties without explicit opt-in.
          </p>
        </div>

        {/* RIGHT COLUMN: Job Description Input */}
        <div className="p-6 rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-400" />
                <span>2. Job Description</span>
              </h3>

              {/* Tabs */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
                <button
                  onClick={() => setJobInputMode('paste')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                    jobInputMode === 'paste' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Paste Text
                </button>
                <button
                  onClick={() => setJobInputMode('url')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                    jobInputMode === 'url' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Import URL
                </button>
              </div>
            </div>

            {/* Inputs: Role Title & Company */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Target Role Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Machine Learning Engineer"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Target Company</label>
                <input
                  type="text"
                  value={jobCompany}
                  onChange={(e) => setJobCompany(e.target.value)}
                  placeholder="e.g. AI Nexus Corp"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Mode URL */}
            {jobInputMode === 'url' ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    placeholder="https://linkedin.com/jobs/view/... or greenhouse.io/..."
                    className="flex-1 px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={handleFetchUrl}
                    disabled={isFetchingUrl || !jobUrl}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-1.5"
                  >
                    {isFetchingUrl ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
                    <span>Fetch</span>
                  </button>
                </div>
                <textarea
                  rows={7}
                  value={jobText}
                  onChange={(e) => setJobText(e.target.value)}
                  placeholder="Extracted job description will appear here for confirmation..."
                  className="w-full p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            ) : (
              <textarea
                rows={9}
                value={jobText}
                onChange={(e) => setJobText(e.target.value)}
                placeholder="Paste the full job posting requirements and responsibilities..."
                className="w-full p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-mono focus:outline-none focus:border-blue-500"
              />
            )}
          </div>
        </div>
      </div>

      {/* Trigger Button or Animated Processing Experience */}
      <div className="pt-4">
        {isAnalyzing ? (
          <div className="p-8 rounded-3xl border border-blue-500/30 bg-slate-900/80 backdrop-blur-xl max-w-xl mx-auto space-y-6 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto animate-pulse">
              <Sparkles className="w-6 h-6 animate-spin" />
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-white">AI Engine Processing</h3>
              <p className="text-xs text-blue-400 font-mono animate-fade-in">
                {stages[currentStage]}
              </p>
            </div>

            {/* Stages Checklist */}
            <div className="space-y-2 text-left text-xs max-w-md mx-auto pt-2 border-t border-slate-800">
              {stages.map((stg, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  {idx < currentStage ? (
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : idx === currentStage ? (
                    <RefreshCw className="w-4 h-4 text-blue-400 animate-spin shrink-0" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                  )}
                  <span className={idx <= currentStage ? 'text-slate-200 font-medium' : 'text-slate-600'}>
                    {stg}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <button
            onClick={handleRunAnalysis}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#1677FF] to-[#06D6FF] hover:opacity-95 text-[#07111F] text-sm font-extrabold shadow-xl shadow-[#1677FF]/25 flex items-center justify-center gap-2.5 transition transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 fill-[#07111F]" />
            <span>Analyze Compatibility & Generate Actionable Roadmap</span>
          </button>
        )}
      </div>
    </div>
  );
};
