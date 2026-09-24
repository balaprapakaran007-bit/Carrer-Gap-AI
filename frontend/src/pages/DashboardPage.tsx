import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../context/DashboardContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';
import { FullAnalysisResult, SkillAnalysisItem, ProjectGapItem } from '../types';

import { CareerReadinessRing } from '../components/CareerReadinessRing';
import { CareerMomentumCard } from '../components/CareerMomentumCard';
import { SkillIntelligence } from '../components/SkillIntelligence';
import { SkillGapVisualizer } from '../components/SkillGapVisualizer';
import { NextBestActionCard } from '../components/NextBestActionCard';
import { TargetRoleCards } from '../components/TargetRoleCards';
import { CareerProgressChart } from '../components/CareerProgressChart';
import { RecentActivityTimeline } from '../components/RecentActivityTimeline';
import { AICareerInsightCard } from '../components/AICareerInsightCard';
import { FirstRunChecklist } from '../components/FirstRunChecklist';
import { SkillDetailDrawer } from '../components/SkillDetailDrawer';
import { ProjectPlanModal } from '../components/ProjectPlanModal';

import {
  Sparkles,
  ArrowRight,
  ChevronDown,
  Upload,
  Layers,
  SlidersHorizontal,
  FileDown
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const {
    activeRoleId,
    setActiveRoleId,
    availableRoles,
    isDemoMode,
    dashboardLayout,
    toggleWidgetVisibility
  } = useDashboard();

  const [analyses, setAnalyses] = useState<FullAnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<SkillAnalysisItem | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectGapItem | null>(null);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const anList = await api.listAnalyses();
        setAnalyses(anList);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const handleExportPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      window.print();
      setIsExporting(false);
    }, 400);
  };

  const currentAnalysis = analyses.find((a) => a.id === activeRoleId) || analyses[0];
  const readiness = currentAnalysis ? currentAnalysis.readinessScore : 78;
  const targetCompany = currentAnalysis ? currentAnalysis.jobCompany : 'AI Nexus Corp';

  const demoSkills: SkillAnalysisItem[] = (currentAnalysis && (currentAnalysis as any).skillBreakdown) || [
    {
      skill: 'Python',
      status: 'Matched',
      importance: 'High',
      evidenceLevel: 'Strong',
      matchedResumeText: 'Developed production data pipelines and LLM inference wrappers using Python 3.11',
      whyItMatters: 'Foundational language for MLE architectures and backend microservices.',
      recommendation: 'Solid evidence. Focus on concurrency & profiling.'
    },
    {
      skill: 'SQL',
      status: 'Matched',
      importance: 'High',
      evidenceLevel: 'Strong',
      matchedResumeText: 'Authored complex analytic queries and window functions over 50M+ rows',
      whyItMatters: 'Essential for feature engineering and training dataset extraction.',
      recommendation: 'Benchmark query plans and data warehouse structures.'
    },
    {
      skill: 'PyTorch',
      status: 'Matched',
      importance: 'High',
      evidenceLevel: 'Strong',
      matchedResumeText: 'Fine-tuned Llama-3 and BERT models with LoRA/QLoRA in PyTorch',
      whyItMatters: 'Core deep learning framework required for custom model pipelines.',
      recommendation: 'Add distributed multi-GPU training benchmarks.'
    },
    {
      skill: 'RAG Architecture',
      status: 'Matched',
      importance: 'High',
      evidenceLevel: 'Strong',
      matchedResumeText: 'Constructed hybrid vector search with Pinecone and LangChain',
      whyItMatters: 'Top differentiator for modern generative AI applications.',
      recommendation: 'Demonstrate evaluation harness (Ragas / TruLens).'
    },
    {
      skill: 'FastAPI',
      status: 'Weak',
      importance: 'Medium',
      evidenceLevel: 'Moderate',
      matchedResumeText: 'Built simple REST endpoints for machine learning models',
      whyItMatters: 'Needed for high-throughput model serving microservices.',
      recommendation: 'Add async handlers, Pydantic v2 schemas, and latency tests.'
    },
    {
      skill: 'Docker',
      status: 'Missing',
      importance: 'High',
      evidenceLevel: 'None',
      matchedResumeText: '',
      whyItMatters: 'Critical gap: model containerization & reproducible runtime dependencies.',
      recommendation: 'Containerize an ML API with multi-stage build and GPU runtime.'
    },
    {
      skill: 'AWS Cloud',
      status: 'Missing',
      importance: 'Medium',
      evidenceLevel: 'None',
      matchedResumeText: '',
      whyItMatters: 'Cloud infrastructure deployment for model endpoints.',
      recommendation: 'Deploy containerized endpoint on ECS or SageMaker.'
    }
  ];

  const matchedCount = demoSkills.filter(s => s.status === 'Matched').length;
  const missingCount = demoSkills.filter(s => s.status === 'Missing').length;
  const weakCount = demoSkills.filter(s => s.status === 'Weak').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-in fade-in duration-200">
      
      {/* 1. HERO SECTION (Section 6 & 6A) */}
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8 shadow-sm">
        <div 
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl opacity-15"
          style={{ backgroundColor: 'var(--primary)' }}
        />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            {/* Target Role Switcher (6A) */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[var(--text-muted)]">Target Role:</span>
              <div className="relative inline-block">
                <select
                  value={activeRoleId}
                  onChange={(e) => setActiveRoleId(e.target.value)}
                  className="appearance-none rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] py-1.5 pl-3 pr-8 text-xs font-bold text-[var(--text-main)] shadow-sm focus:outline-none focus:border-[var(--primary)] cursor-pointer"
                >
                  {availableRoles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.title} ({role.company})
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 text-[var(--text-muted)]" />
              </div>

              {isDemoMode && (
                <span 
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-bold border"
                  style={{
                    backgroundColor: 'var(--primary-muted)',
                    color: 'var(--primary)',
                    borderColor: 'var(--primary)'
                  }}
                >
                  Live Intelligence Demo
                </span>
              )}
            </div>

            {/* Greeting & Headline */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-main)]">
                Good morning, {user?.name?.split(' ')[0] || 'Alex'} 👋
              </h1>
              <p className="text-sm font-medium text-[var(--text-muted)] mt-1">
                Your career readiness is moving forward. You're <strong className="text-[var(--text-main)]">{missingCount} skills</strong> away from your target role at <strong className="text-[var(--text-main)]">{targetCompany}</strong>.
              </p>
            </div>

            {/* Progress CTA */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div 
                className="flex items-center gap-2 rounded-xl px-3 py-1.5 border"
                style={{
                  backgroundColor: 'var(--primary-muted)',
                  borderColor: 'var(--primary)',
                  color: 'var(--primary)'
                }}
              >
                <span className="text-xs font-bold">{readiness}% Job Readiness</span>
                <span className="text-[11px] font-semibold text-emerald-400">+14% this month</span>
              </div>

              <Link
                to={`/roadmaps/${currentAnalysis?.id || 'demo-analysis-ml-01'}`}
                className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-md transition hover:opacity-90"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                <span>Continue Career Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Actions & Header Tools */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] text-xs font-medium text-[var(--text-main)] hover:border-[var(--border-strong)] transition"
                title="Export report summary as printable PDF"
              >
                <FileDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                <span>{isExporting ? 'Preparing...' : 'Export Report'}</span>
              </button>

              <button
                onClick={() => setIsCustomizeOpen(!isCustomizeOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] text-xs font-medium text-[var(--text-main)] hover:border-[var(--border-strong)] transition"
                title="Customize dashboard layout"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                <span>Customize</span>
              </button>
            </div>

            {/* Quick Actions Toolbar */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Link
                to="/analyze"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] text-xs font-semibold text-[var(--text-main)] hover:border-[var(--primary)] transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />
                <span>Analyze Job</span>
              </Link>
              <Link
                to="/analyze?tab=resume"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] text-xs font-semibold text-[var(--text-main)] hover:border-[var(--primary)] transition"
              >
                <Upload className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                <span>Upload Resume</span>
              </Link>
              <Link
                to="/multi-compare"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] text-xs font-semibold text-[var(--text-main)] hover:border-[var(--primary)] transition"
              >
                <Layers className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                <span>Compare Jobs</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Layout Customization Drawer / Panel */}
        {isCustomizeOpen && (
          <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] animate-in fade-in duration-150">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[var(--text-main)]">Customize Visible Dashboard Sections</span>
              <button
                onClick={() => setIsCustomizeOpen(false)}
                className="text-[11px] text-[var(--primary)] font-semibold hover:underline"
              >
                Done
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'momentum' as const, label: 'Career Momentum' },
                { id: 'skills' as const, label: 'Skill Gap Visualizer' },
                { id: 'progress' as const, label: 'Career Progress Chart' },
                { id: 'insight' as const, label: 'AI Career Insight' },
                { id: 'activity' as const, label: 'Recent Activity' },
              ].map((w) => (
                <button
                  key={w.id}
                  onClick={() => toggleWidgetVisibility(w.id)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition ${
                    dashboardLayout.find((item) => item.id === w.id)?.visible
                      ? 'border-[var(--primary)] bg-[var(--primary-muted)] text-[var(--primary)] font-semibold'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-muted)] opacity-60'
                  }`}
                >
                  {dashboardLayout.find((item) => item.id === w.id)?.visible ? '✓ ' : '+ '}
                  {w.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. GUIDED FIRST-RUN CHECKLIST */}
      <FirstRunChecklist />

      {/* 3. PRIMARY CORE SECTION: READINESS RING & NEXT BEST ACTION & MOMENTUM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Career Readiness Ring */}
        <div id="readiness-ring-section" className="lg:col-span-5">
          <CareerReadinessRing
            score={readiness}
            matchedCount={matchedCount}
            missingCount={missingCount}
            weakCount={weakCount}
            criticalCount={2}
            analysisId={currentAnalysis?.id || 'demo-analysis-ml-01'}
            roleTitle={currentAnalysis?.jobTitle || 'Machine Learning Engineer'}
          />
        </div>

        {/* Right: Next Best Action & Career Momentum */}
        <div className="lg:col-span-7 space-y-6">
          <div id="next-action-section">
            <NextBestActionCard analysisId={currentAnalysis?.id || 'demo-analysis-ml-01'} />
          </div>

          {dashboardLayout.find((w) => w.id === 'momentum')?.visible && (
            <CareerMomentumCard />
          )}
        </div>
      </div>

      {/* 4. SKILL INTELLIGENCE SECTION */}
      <div id="skill-intelligence-section" className="space-y-4">
        <SkillIntelligence
          skills={demoSkills}
          onSelectSkill={(skill) => setSelectedSkill(skill)}
          onAddToRoadmap={(skillName: string) => {
            navigate(`/roadmaps/${currentAnalysis?.id || 'demo-analysis-ml-01'}?seedSkill=${encodeURIComponent(skillName)}`);
          }}
        />
      </div>

      {/* 5. SKILL GAP COMPARISON VISUALIZER */}
      {dashboardLayout.find((w) => w.id === 'skills')?.visible && (
        <div>
          <SkillGapVisualizer />
        </div>
      )}

      {/* 6. AI STRATEGIC INSIGHT CARD */}
      {dashboardLayout.find((w) => w.id === 'insight')?.visible && (
        <div>
          <AICareerInsightCard
            insightText="Your strongest alignment is in Python, SQL and RAG. Your biggest opportunity is deployment experience. Building one Docker + FastAPI project could close two high-priority gaps simultaneously."
            recommendedProjectTitle="Enterprise Document QA with Docker & FastAPI"
            onOpenProject={() => setSelectedProject({
              id: "proj-docker-fastapi",
              title: "Enterprise Document QA with Docker & FastAPI",
              description: "Build an end-to-end question answering pipeline containerized with Docker and served with FastAPI.",
              closesSkills: ["Docker", "FastAPI", "Python"],
              difficulty: "Intermediate",
              estimatedDays: 4,
              coreFeatures: ["Containerized deployment", "Async API endpoints", "Health checks"],
              technologies: ["Docker", "FastAPI", "Python", "Uvicorn"],
              implementationSteps: [
                "Setup FastAPI with async endpoints",
                "Create Dockerfile with multi-stage build",
                "Add docker-compose for local DB and vector storage",
                "Write automated integration tests"
              ],
              resumeBullet: "Engineered high-throughput containerized QA microservice handling 500+ QPS with Docker and FastAPI."
            })}
          />
        </div>
      )}

      {/* 7. PROGRESS CHART & TARGET ROLES GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {dashboardLayout.find((w) => w.id === 'progress')?.visible && (
          <div className="lg:col-span-7">
            <CareerProgressChart />
          </div>
        )}

        <div className={dashboardLayout.find((w) => w.id === 'progress')?.visible ? 'lg:col-span-5' : 'lg:col-span-12'}>
          <TargetRoleCards analyses={analyses} />
        </div>
      </div>

      {/* 8. RECENT ACTIVITY TIMELINE */}
      {dashboardLayout.find((w) => w.id === 'activity')?.visible && (
        <div>
          <RecentActivityTimeline />
        </div>
      )}

      {/* MODALS / DRAWERS */}
      {selectedSkill && (
        <SkillDetailDrawer
          skill={selectedSkill}
          onClose={() => setSelectedSkill(null)}
          analysisId={currentAnalysis?.id || 'demo-analysis-ml-01'}
        />
      )}

      {selectedProject && (
        <ProjectPlanModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
};
