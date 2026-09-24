import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { firestoreService } from '../services/firebase';
import { FullAnalysisResult, SkillAnalysisItem, ProjectGapItem } from '../types';
import { SkillMatrixTable } from '../components/SkillMatrixTable';
import { SkillDetailDrawer } from '../components/SkillDetailDrawer';
import { EvidenceAnalysisCard } from '../components/EvidenceAnalysisCard';
import { ProjectPlanModal } from '../components/ProjectPlanModal';
import { RoadmapTimeline } from '../components/RoadmapTimeline';
import { ScoreBreakdownCard } from '../components/ScoreBreakdownCard';
import {
  Sparkles, CheckCircle2, XCircle, AlertTriangle, Mic, Share2,
  RefreshCw, Download, FileText, Layers, MapPin, Award, Check, Copy, ExternalLink,
  ChevronRight, ArrowRight, ShieldCheck, HelpCircle
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const AnalysisResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState<FullAnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'matrix' | 'evidence' | 'projects' | 'roadmap' | 'resume' | 'score'>('matrix');
  const [selectedSkill, setSelectedSkill] = useState<SkillAnalysisItem | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectGapItem | null>(null);
  
  // Share & Version Diff Modals
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [shareEnabled, setShareEnabled] = useState<boolean>(true);
  const [shareToken, setShareToken] = useState<string>('');
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);
  const [compareData, setCompareData] = useState<any>(null);

  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const data = await api.getAnalysis(id || 'demo-analysis-ml-01');
        setAnalysis(data);
        setShareEnabled(data.isShareable);
        setShareToken(data.shareToken || 'demo-share-careergap-2026');
        // Persist to Cloud Firestore
        await firestoreService.saveAnalysis(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [id]);

  const handleToggleShare = async () => {
    if (!analysis) return;
    const nextState = !shareEnabled;
    setShareEnabled(nextState);
    try {
      const res = await api.toggleShare(analysis.id, nextState);
      if (res.shareToken) setShareToken(res.shareToken);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyShareLink = () => {
    const fullUrl = `${window.location.origin}/share/${shareToken || 'demo-share-careergap-2026'}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleOpenCompare = async () => {
    if (!analysis) return;
    try {
      const res = await api.compareAnalysis(analysis.id);
      setCompareData(res);
      setShowCompareModal(true);
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportPDF = async () => {
    const element = document.getElementById('analysis-report-container');
    if (!element) return;
    setIsExportingPdf(true);
    try {
      const canvas = await html2canvas(element, { scale: 1.5, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`CareerGap_${analysis?.jobTitle || 'Analysis'}.pdf`);
    } catch (err) {
      console.error('PDF export failed', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto animate-spin">
            <Sparkles className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-400 font-mono">Loading CareerGap AI Analysis...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="p-8 text-center text-slate-400 space-y-4">
        <p>Analysis not found.</p>
        <Link to="/analyze" className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold">
          Start New Analysis
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 selection:bg-blue-500 selection:text-white">
      
      <div id="analysis-report-container" className="space-y-6">
        
        {/* Top Header Card with Readiness Score Gauge */}
        <div className="p-6 sm:p-8 rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Verified Career Fit Analysis
              </span>
              <span className="text-xs text-slate-400">• {analysis.jobCompany}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white">{analysis.jobTitle}</h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              {analysis.summaryParagraph}
            </p>
          </div>

          {/* Readiness Score Card */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-5 shrink-0 shadow-lg">
            <div className="relative w-20 h-20 flex items-center justify-center">
              {/* Circular Progress Representation */}
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="34" stroke="#1e293b" strokeWidth="6" fill="transparent" />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke="#3b82f6"
                  strokeWidth="6"
                  strokeDasharray={213}
                  strokeDashoffset={213 - (213 * analysis.readinessScore) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-black text-white">{Math.round(analysis.readinessScore)}%</span>
              </div>
            </div>

            <div className="space-y-1 text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Job Readiness</span>
              <div className="text-xs font-semibold text-emerald-400">Moderate Alignment</div>
              <span className="text-[11px] text-slate-500 block">Target: 90%+ Job Ready</span>
            </div>
          </div>
        </div>

        {/* Breakdown Badges Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl border border-slate-800/80 bg-slate-900/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black text-white">{analysis.matchedCount}</span>
              <span className="block text-[11px] text-slate-400">Matched Skills</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-slate-800/80 bg-slate-900/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black text-white">{analysis.missingCount}</span>
              <span className="block text-[11px] text-slate-400">Missing Skills</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-slate-800/80 bg-slate-900/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black text-white">{analysis.weakEvidenceCount}</span>
              <span className="block text-[11px] text-slate-400">Weak Evidence</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-slate-800/80 bg-slate-900/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black text-white">{analysis.criticalRequirementsCount}</span>
              <span className="block text-[11px] text-slate-400">Critical Requirements</span>
            </div>
          </div>
        </div>

        {/* Persistent Action Bar */}
        <div className="p-3.5 rounded-2xl border border-slate-800/80 bg-slate-950/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/interview/${analysis.id}`}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#1677FF] to-[#06D6FF] hover:opacity-95 text-[#07111F] text-xs font-extrabold flex items-center gap-2 shadow-md shadow-[#1677FF]/20 transition"
            >
              <Mic className="w-4 h-4 text-[#07111F]" />
              <span>Practice Mock Interview</span>
            </Link>

            <button
              onClick={() => setShowShareModal(true)}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-2 transition"
            >
              <Share2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Share Profile</span>
            </button>

            <button
              onClick={handleOpenCompare}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-2 transition"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              <span>Re-analyze (Version Diff)</span>
            </button>
          </div>

          <button
            onClick={handleExportPDF}
            disabled={isExportingPdf}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-2 transition disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>{isExportingPdf ? 'Exporting PDF...' : 'Export PDF Report'}</span>
          </button>
        </div>

        {/* Main Content Tabs */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto pb-1">
            {[
              { key: 'matrix', label: 'Skill Matrix', icon: Layers },
              { key: 'evidence', label: 'Evidence Analysis', icon: ShieldCheck },
              { key: 'projects', label: 'Project Gap Detector', icon: Sparkles },
              { key: 'roadmap', label: 'Personalized Roadmap', icon: MapPin },
              { key: 'resume', label: 'Resume Improvements', icon: FileText },
              { key: 'score', label: 'Score Breakdown', icon: Award },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-xs whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: Skill Matrix */}
          {activeTab === 'matrix' && (
            <SkillMatrixTable
              skills={analysis.skillsMatrix}
              onSelectSkill={(skill) => setSelectedSkill(skill)}
            />
          )}

          {/* TAB 2: Evidence Analysis */}
          {activeTab === 'evidence' && (
            <EvidenceAnalysisCard skills={analysis.skillsMatrix} />
          )}

          {/* TAB 3: Project Gaps */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Projects That Would Close Your Gaps</h3>
                  <p className="text-xs text-slate-400">
                    Engineered practical, multi-skill portfolio projects designed to demonstrate your missing requirements.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.projectGaps.map((proj, idx) => (
                  <div
                    key={proj.id || idx}
                    className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                          {proj.difficulty} • ~{proj.estimatedDays} Days
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                          Project {idx + 1}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-white">{proj.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>

                      <div className="space-y-1.5 pt-2">
                        <span className="text-[10px] uppercase font-bold text-slate-500">Closes Missing Skills:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {proj.closesSkills.map((s, sIdx) => (
                            <span key={sIdx} className="px-2 py-0.5 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              ✓ {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedProject(proj)}
                      className="w-full py-2.5 px-4 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30 text-blue-300 text-xs font-bold transition flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                      <span>Generate Project Plan</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Personalized Roadmap */}
          {activeTab === 'roadmap' && (
            <RoadmapTimeline steps={analysis.roadmap} />
          )}

          {/* TAB 5: Resume Improvements */}
          {activeTab === 'resume' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">Grounded Resume Improvements</h3>
                <p className="text-xs text-slate-400">
                  Action-oriented suggestions based only on your actual projects, replacing weak buzzwords with quantified evidence.
                </p>
              </div>

              <div className="space-y-4">
                {analysis.resumeSuggestions.map((sug, i) => (
                  <div key={i} className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/20">
                        Targeting: {sug.targetedSkill}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{sug.reason}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-rose-400">Original Resume Bullet</span>
                        <p className="text-xs italic text-slate-400">"{sug.originalText || 'Listed as buzzword'}"</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-emerald-400">Recommended STAR Format</span>
                        <p className="text-xs font-medium text-emerald-100">"{sug.improvedText}"</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: Score Breakdown */}
          {activeTab === 'score' && (
            <ScoreBreakdownCard
              breakdown={analysis.scoreBreakdown}
              overallScore={analysis.readinessScore}
            />
          )}
        </div>
      </div>

      {/* Skill Detail Drawer */}
      <SkillDetailDrawer
        skill={selectedSkill}
        onClose={() => setSelectedSkill(null)}
        analysisId={analysis.id}
      />

      {/* Project Plan Specification Modal */}
      <ProjectPlanModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Share Profile Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowShareModal(false)} className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Share Public Readiness Profile</h3>
            <p className="text-xs text-slate-400">
              Generate a secure, read-only link showcasing your readiness score and strengths without exposing private resume text.
            </p>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-200 font-semibold">Make Profile Public</span>
              <button
                onClick={handleToggleShare}
                className={`w-11 h-6 rounded-full transition-colors relative ${shareEnabled ? 'bg-blue-600' : 'bg-slate-700'}`}
              >
                <span className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${shareEnabled ? 'right-1' : 'left-1'}`} />
              </button>
            </div>

            {shareEnabled && (
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-400">Public Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/share/${shareToken}`}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono"
                  />
                  <button
                    onClick={handleCopyShareLink}
                    className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Version Comparison Modal */}
      {showCompareModal && compareData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowCompareModal(false)} className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Resume Version Comparison</h3>
            <p className="text-xs text-slate-400">
              Direct before/after effect of your updated resume on readiness score and evidence strength.
            </p>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Previous Score</span>
                <div className="text-xl font-bold text-slate-300">{compareData.previousScore}%</div>
              </div>
              <ArrowRight className="w-5 h-5 text-emerald-400" />
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Updated Score</span>
                <div className="text-2xl font-black text-emerald-400">{compareData.currentScore}%</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300">Evidence Transitions:</h4>
              <div className="space-y-1.5">
                {compareData.improvedSkills.map((sk: any, i: number) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs flex items-center justify-between">
                    <span className="font-semibold text-slate-200">{sk.skill}</span>
                    <span className="text-emerald-400 font-semibold">{sk.previousStatus} → {sk.currentEvidence}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowCompareModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
