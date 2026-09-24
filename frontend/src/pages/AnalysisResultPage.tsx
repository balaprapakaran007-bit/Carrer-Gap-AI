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
  RefreshCw, Download, FileText, Layers, MapPin, Award, Check, Copy,
  ArrowRight, ShieldCheck, Clock
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
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  useEffect(() => {
    let timer: any = null;
    if (loading) {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [loading]);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const data = await api.getAnalysis(id || 'demo-analysis-ml-01');
        setAnalysis(data);
        setShareEnabled(data.isShareable);
        setShareToken(data.shareToken || 'demo-share-careergap-2026');
        setLoading(false);
        // Persist to Cloud Firestore asynchronously in background
        firestoreService.saveAnalysis(data).catch((e) => console.warn('Firestore background sync:', e));
      } catch (err) {
        console.error(err);
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
      pdf.save(`CareerGap_Analysis_${analysis?.jobTitle.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('PDF export error', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  if (loading) {
    const mins = Math.floor(elapsedSeconds / 60);
    const secs = elapsedSeconds % 60;
    const timerStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}s`;

    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 bg-white">
        <div className="p-8 rounded-3xl border border-[#E7E5E4] bg-white max-w-md w-full space-y-6 text-center shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF3E8] border border-[#F97316]/20 flex items-center justify-center text-[#F97316] mx-auto shadow-sm">
            <Sparkles className="w-6 h-6 animate-spin" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1C1917]">Retrieving Competency Profile</h3>
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#78716C] font-mono mt-1">
              <Clock className="w-3.5 h-3.5 text-[#F97316]" />
              <span>Elapsed: {timerStr}</span>
            </div>
          </div>

          <div className="space-y-2.5 text-left text-xs pt-3 border-t border-[#E7E5E4]">
            <div className="flex items-center gap-2.5 text-[#16A34A] font-semibold">
              <Check className="w-4 h-4 shrink-0" />
              <span>Resume parsed & skills indexed</span>
            </div>
            <div className="flex items-center gap-2.5 text-[#16A34A] font-semibold">
              <Check className="w-4 h-4 shrink-0" />
              <span>Job requirements & importance levels aligned</span>
            </div>
            <div className="flex items-center gap-2.5 text-[#16A34A] font-semibold">
              <Check className="w-4 h-4 shrink-0" />
              <span>Evidence matrix built</span>
            </div>
            <div className="flex items-center gap-2.5 text-[#F97316] font-bold">
              <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
              <span>Finding project recommendations</span>
            </div>
            <div className="flex items-center gap-2.5 text-[#F97316] font-bold">
              <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
              <span>Generating personalized roadmap</span>
            </div>
          </div>

          {elapsedSeconds >= 15 && (
            <p className="text-[11px] text-[#78716C] bg-[#FAFAFA] p-3 rounded-xl border border-[#E7E5E4] animate-in fade-in">
              💡 Complex resumes and job descriptions can take up to a minute.
            </p>
          )}
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="p-8 text-center space-y-4 bg-white">
        <p className="text-sm text-[#78716C]">Analysis not found.</p>
        <Link to="/analyze" className="text-xs font-bold text-[#F97316]">Analyze New Job →</Link>
      </div>
    );
  }

  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * analysis.readinessScore) / 100;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 selection:bg-[#F97316] selection:text-white bg-white">
      
      <div id="analysis-report-container" className="space-y-6">
        {/* Top Header Card */}
        <div className="p-6 sm:p-8 rounded-3xl border border-[#E7E5E4] bg-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF3E8] border border-[#F97316]/20 text-[#F97316] text-[11px] font-bold">
              <Sparkles className="w-3.5 h-3.5 fill-[#F97316]" />
              <span>Verified Career Gap Breakdown</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#1C1917]">
              {analysis.jobTitle}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-[#78716C]">
              <span className="font-semibold text-[#1C1917]">{analysis.jobCompany}</span>
              <span>•</span>
              <span>Resume: {(analysis as any).candidateResumeName || 'Primary Resume'}</span>
              <span>•</span>
              <span>Analyzed: {new Date(analysis.createdAt || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Mini Radial Gauge */}
          <div className="flex items-center gap-4 bg-[#FAFAFA] p-4 rounded-2xl border border-[#E7E5E4] shrink-0">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  stroke="#E7E5E4"
                  strokeWidth="7"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  stroke="#F97316"
                  strokeWidth="7"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-black text-[#1C1917]">{Math.round(analysis.readinessScore)}%</span>
              </div>
            </div>

            <div className="space-y-1 text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716C]">Job Readiness</span>
              <div className="text-xs font-semibold text-[#16A34A]">Moderate Alignment</div>
              <span className="text-[11px] text-[#78716C] block">Target: 90%+ Job Ready</span>
            </div>
          </div>
        </div>

        {/* Breakdown Badges Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl border border-[#E7E5E4] bg-white shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] border border-[#16A34A]/20 flex items-center justify-center text-[#16A34A]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black text-[#1C1917]">{analysis.matchedCount}</span>
              <span className="block text-[11px] text-[#78716C]">Matched Skills</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-[#E7E5E4] bg-white shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FEE2E2] border border-[#DC2626]/20 flex items-center justify-center text-[#DC2626]">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black text-[#1C1917]">{analysis.missingCount}</span>
              <span className="block text-[11px] text-[#78716C]">Missing Skills</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-[#E7E5E4] bg-white shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] border border-[#D97706]/20 flex items-center justify-center text-[#D97706]">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black text-[#1C1917]">{analysis.weakEvidenceCount}</span>
              <span className="block text-[11px] text-[#78716C]">Weak Evidence</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-[#E7E5E4] bg-white shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF3E8] border border-[#F97316]/20 flex items-center justify-center text-[#F97316]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black text-[#1C1917]">{analysis.criticalRequirementsCount}</span>
              <span className="block text-[11px] text-[#78716C]">Critical Requirements</span>
            </div>
          </div>
        </div>

        {/* Persistent Action Bar */}
        <div className="p-3.5 rounded-2xl border border-[#E7E5E4] bg-white shadow-sm flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/interview/${analysis.id}`}
              className="px-4 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition cursor-pointer"
            >
              <Mic className="w-4 h-4 text-white" />
              <span>Practice Mock Interview</span>
            </Link>

            <button
              onClick={() => setShowShareModal(true)}
              className="px-4 py-2 rounded-xl bg-white hover:bg-[#FAFAFA] border border-[#E7E5E4] text-xs font-semibold text-[#1C1917] flex items-center gap-2 transition cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-[#F97316]" />
              <span>Share Profile</span>
            </button>

            <button
              onClick={handleOpenCompare}
              className="px-4 py-2 rounded-xl bg-white hover:bg-[#FAFAFA] border border-[#E7E5E4] text-xs font-semibold text-[#1C1917] flex items-center gap-2 transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Re-analyze (Version Diff)</span>
            </button>
          </div>

          <button
            onClick={handleExportPDF}
            disabled={isExportingPdf}
            className="px-4 py-2 rounded-xl bg-white hover:bg-[#FAFAFA] border border-[#E7E5E4] text-xs font-semibold text-[#1C1917] flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#78716C]" />
            <span>{isExportingPdf ? 'Exporting PDF...' : 'Export PDF Report'}</span>
          </button>
        </div>

        {/* Main Content Tabs */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-[#E7E5E4] overflow-x-auto pb-1">
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
                      ? 'border-[#F97316] text-[#F97316] bg-[#FFF3E8]'
                      : 'border-transparent text-[#78716C] hover:text-[#1C1917] hover:border-[#E7E5E4]'
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
              <div>
                <h3 className="text-base font-bold text-[#1C1917]">Projects That Would Close Your Gaps</h3>
                <p className="text-xs text-[#78716C]">
                  Engineered practical, multi-skill portfolio projects designed to demonstrate your missing requirements.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.projectGaps.map((proj, idx) => (
                  <div
                    key={proj.id || idx}
                    className="p-6 rounded-2xl border border-[#E7E5E4] bg-white shadow-sm flex flex-col justify-between space-y-4 hover:border-[#F97316]/50 transition"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#F97316]">
                          {proj.difficulty} • ~{proj.estimatedDays} Days
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FAFAFA] text-[#1C1917] border border-[#E7E5E4]">
                          Project {idx + 1}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-[#1C1917]">{proj.title}</h4>
                      <p className="text-xs text-[#78716C] leading-relaxed">{proj.description}</p>

                      <div className="space-y-1.5 pt-2">
                        <span className="text-[10px] uppercase font-bold text-[#78716C]">Closes Missing Skills:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {proj.closesSkills.map((s, sIdx) => (
                            <span key={sIdx} className="px-2 py-0.5 rounded-md text-xs font-semibold bg-[#DCFCE7] text-[#16A34A] border border-[#16A34A]/20">
                              ✓ {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedProject(proj)}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#FFF3E8] hover:bg-[#F97316] text-[#F97316] hover:text-white border border-[#F97316]/20 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
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
                <h3 className="text-base font-bold text-[#1C1917]">Grounded Resume Improvements</h3>
                <p className="text-xs text-[#78716C]">
                  Action-oriented suggestions based only on your actual projects, replacing weak buzzwords with quantified evidence.
                </p>
              </div>

              <div className="space-y-4">
                {analysis.resumeSuggestions.map((sug, i) => (
                  <div key={i} className="p-5 rounded-2xl border border-[#E7E5E4] bg-white shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFF3E8] text-[#F97316] border border-[#F97316]/20">
                        Targeting: {sug.targetedSkill}
                      </span>
                      <span className="text-xs text-[#78716C] font-medium">{sug.reason}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <div className="p-3.5 rounded-xl bg-[#FAFAFA] border border-[#E7E5E4] space-y-1">
                        <span className="text-[10px] uppercase font-bold text-[#DC2626]">Original Resume Bullet</span>
                        <p className="text-xs italic text-[#78716C]">"{sug.originalText || 'Listed as buzzword'}"</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#DCFCE7]/40 border border-[#16A34A]/20 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-[#16A34A]">Recommended STAR Format</span>
                        <p className="text-xs font-medium text-[#1C1917]">"{sug.improvedText}"</p>
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
          <div onClick={() => setShowShareModal(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative w-full max-w-md rounded-3xl border border-[#E7E5E4] bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-[#1C1917]">Share Public Readiness Profile</h3>
            <p className="text-xs text-[#78716C]">
              Generate a secure, read-only link showcasing your readiness score and strengths without exposing private resume text.
            </p>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAFAFA] border border-[#E7E5E4]">
              <span className="text-xs text-[#1C1917] font-semibold">Make Profile Public</span>
              <button
                onClick={handleToggleShare}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${shareEnabled ? 'bg-[#F97316]' : 'bg-[#E7E5E4]'}`}
              >
                <span className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${shareEnabled ? 'right-1' : 'left-1'}`} />
              </button>
            </div>

            {shareEnabled && (
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-[#78716C]">Public Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/share/${shareToken}`}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#FAFAFA] border border-[#E7E5E4] text-xs text-[#1C1917] font-mono"
                  />
                  <button
                    onClick={handleCopyShareLink}
                    className="px-3.5 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
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
                className="px-4 py-2 rounded-xl bg-[#FAFAFA] hover:bg-[#F5F5F4] text-xs font-bold text-[#1C1917] border border-[#E7E5E4] cursor-pointer"
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
          <div onClick={() => setShowCompareModal(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg rounded-3xl border border-[#E7E5E4] bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-[#1C1917]">Resume Version Comparison</h3>
            <p className="text-xs text-[#78716C]">
              Direct before/after effect of your updated resume on readiness score and evidence strength.
            </p>

            <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-[#E7E5E4] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#78716C] uppercase font-bold">Previous Score</span>
                <div className="text-xl font-bold text-[#1C1917]">{compareData.previousScore}%</div>
              </div>
              <ArrowRight className="w-5 h-5 text-[#16A34A]" />
              <div className="text-right">
                <span className="text-[10px] text-[#78716C] uppercase font-bold">Updated Score</span>
                <div className="text-2xl font-black text-[#16A34A]">{compareData.currentScore}%</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#1C1917]">Evidence Transitions:</h4>
              <div className="space-y-1.5">
                {compareData.improvedSkills.map((sk: any, i: number) => (
                  <div key={i} className="p-2.5 rounded-xl bg-[#FAFAFA] border border-[#E7E5E4] text-xs flex items-center justify-between">
                    <span className="font-semibold text-[#1C1917]">{sk.skill}</span>
                    <span className="text-[#16A34A] font-semibold">{sk.previousStatus} → {sk.currentEvidence}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowCompareModal(false)}
                className="px-4 py-2 rounded-xl bg-[#FAFAFA] hover:bg-[#F5F5F4] text-xs font-bold text-[#1C1917] border border-[#E7E5E4] cursor-pointer"
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
