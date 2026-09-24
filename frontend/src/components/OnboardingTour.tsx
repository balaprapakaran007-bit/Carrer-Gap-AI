import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, X, Check, Target, Compass, Zap, Keyboard } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

interface TourStep {
  title: string;
  description: string;
  icon: React.ElementType;
  targetAnchor?: string;
}

export const OnboardingTour: React.FC = () => {
  const { hasSeenTour, setHasSeenTour } = useDashboard();
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!hasSeenTour) {
      const timer = setTimeout(() => setIsOpen(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [hasSeenTour]);

  if (!isOpen || hasSeenTour) return null;

  const tourSteps: TourStep[] = [
    {
      title: 'Interactive Career Readiness Ring',
      description: 'Your holistic match score calculated from matched skills, missing capabilities, and evidence depth. Click any segment to filter your skill matrix.',
      icon: Target,
      targetAnchor: '#readiness-ring-section'
    },
    {
      title: 'Skill Intelligence Grid',
      description: 'Granular breakdown of what is Strong, Improving, or Needs Attention. Sort by target role relevance or drag skills to seed roadmaps.',
      icon: Compass,
      targetAnchor: '#skill-intelligence-section'
    },
    {
      title: 'Your Next Best Action',
      description: 'High-leverage coaching recommendations generated from real gap analysis. Know exactly which project, certification, or proof to build next.',
      icon: Zap,
      targetAnchor: '#next-action-section'
    },
    {
      title: 'Power User Command Palette (⌘K / Ctrl+K)',
      description: 'Hit ⌘K or Ctrl+K anytime to instantly search jobs, switch themes, jump between analyses, or trigger quick actions with your keyboard.',
      icon: Keyboard,
      targetAnchor: '#top-nav'
    }
  ];

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setIsOpen(false);
    setHasSeenTour(true);
  };

  const step = tourSteps[currentStep];
  const Icon = step.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-modal-title"
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-surface)] p-6 shadow-2xl transition-all"
      >
        {/* Glow accent */}
        <div 
          className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full blur-3xl opacity-15"
          style={{ backgroundColor: 'var(--primary)' }}
        />

        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span 
              className="rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wider uppercase"
              style={{ backgroundColor: 'var(--primary-muted)', color: 'var(--primary)' }}
            >
              Step {currentStep + 1} of {tourSteps.length}
            </span>
            <span className="text-xs text-[var(--text-muted)]">Platform Tour</span>
          </div>
          <button
            onClick={handleComplete}
            className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-[var(--text-main)] transition"
            aria-label="Skip tour"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Step Content */}
        <div className="my-4 flex gap-4 items-start">
          <div 
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--primary)]/30"
            style={{ backgroundColor: 'var(--primary-muted)', color: 'var(--primary)' }}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 id="tour-modal-title" className="text-base font-bold text-[var(--text-main)]">
              {step.title}
            </h3>
            <p className="text-xs leading-relaxed text-[var(--text-muted)]">
              {step.description}
            </p>
          </div>
        </div>

        {/* Dots indicator */}
        <div className="flex items-center justify-center gap-1.5 my-5">
          {tourSteps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentStep
                  ? 'w-6 bg-[var(--primary)]'
                  : 'w-1.5 bg-[var(--border-strong)] opacity-50'
              }`}
            />
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
          <button
            onClick={handleComplete}
            className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] transition"
          >
            Skip tour
          </button>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-1.5 text-xs font-medium text-[var(--text-main)] hover:border-[var(--border-strong)] transition"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Previous</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:opacity-95"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              <span>{currentStep === tourSteps.length - 1 ? 'Finish Tour' : 'Next'}</span>
              {currentStep === tourSteps.length - 1 ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <ArrowRight className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
