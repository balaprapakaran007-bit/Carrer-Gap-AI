import React, { useState } from 'react';
import { SkillAnalysisItem, EvidenceLevel } from '../types';
import { ShieldCheck, ShieldAlert, AlertCircle, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const EvidenceAnalysisCard: React.FC<{ skills: SkillAnalysisItem[] }> = ({ skills }) => {
  const [expandedLevel, setExpandedLevel] = useState<string | null>('Strong');

  const strong = skills.filter((s) => s.evidenceLevel === 'Strong');
  const moderate = skills.filter((s) => s.evidenceLevel === 'Moderate');
  const weak = skills.filter((s) => s.evidenceLevel === 'Weak');
  const notDemonstrated = skills.filter((s) => s.evidenceLevel === 'Not Demonstrated');

  const categories = [
    {
      level: 'Strong',
      count: strong.length,
      color: 'emerald',
      bgColor: 'bg-emerald-500',
      icon: ShieldCheck,
      description: 'Skills demonstrated in projects or work history with quantified outcomes, metrics, or pipeline scale.',
      items: strong
    },
    {
      level: 'Moderate',
      count: moderate.length,
      color: 'blue',
      bgColor: 'bg-blue-500',
      icon: ShieldAlert,
      description: 'Demonstrated in project or coursework context, but lacks production scale metrics or architectural depth.',
      items: moderate
    },
    {
      level: 'Weak',
      count: weak.length,
      color: 'amber',
      bgColor: 'bg-amber-500',
      icon: AlertCircle,
      description: 'Mentioned only in a keyword or skills list without implementation context. At risk in technical screens.',
      items: weak
    },
    {
      level: 'Not Demonstrated',
      count: notDemonstrated.length,
      color: 'rose',
      bgColor: 'bg-rose-500',
      icon: HelpCircle,
      description: 'Required by the target job description but entirely absent from your current profile.',
      items: notDemonstrated
    }
  ];

  return (
    <div className="space-y-4">
      {/* Evidence Strength Distribution Bar */}
      <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100">Evidence Quality Distribution</h3>
          <span className="text-xs text-slate-400">{skills.length} Evaluated Competencies</span>
        </div>

        {/* Multi-segment Bar */}
        <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden flex">
          {strong.length > 0 && (
            <div
              style={{ width: `${(strong.length / skills.length) * 100}%` }}
              className="bg-emerald-500 h-full transition-all duration-500"
              title={`Strong: ${strong.length}`}
            />
          )}
          {moderate.length > 0 && (
            <div
              style={{ width: `${(moderate.length / skills.length) * 100}%` }}
              className="bg-blue-500 h-full transition-all duration-500"
              title={`Moderate: ${moderate.length}`}
            />
          )}
          {weak.length > 0 && (
            <div
              style={{ width: `${(weak.length / skills.length) * 100}%` }}
              className="bg-amber-500 h-full transition-all duration-500"
              title={`Weak: ${weak.length}`}
            />
          )}
          {notDemonstrated.length > 0 && (
            <div
              style={{ width: `${(notDemonstrated.length / skills.length) * 100}%` }}
              className="bg-rose-500 h-full transition-all duration-500"
              title={`Not Demonstrated: ${notDemonstrated.length}`}
            />
          )}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <span>Strong ({strong.length})</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
            <span>Moderate ({moderate.length})</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
            <span>Weak ({weak.length})</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
            <span>Missing ({notDemonstrated.length})</span>
          </div>
        </div>
      </div>

      {/* Accordion Categories with Citations */}
      <div className="space-y-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isExpanded = expandedLevel === cat.level;

          return (
            <div
              key={cat.level}
              className="rounded-xl border border-slate-800/80 bg-slate-900/30 overflow-hidden transition"
            >
              <button
                onClick={() => setExpandedLevel(isExpanded ? null : cat.level)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-900/60 transition"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${cat.bgColor}/15 flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 text-${cat.color}-400`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-100">{cat.level} Evidence</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                        {cat.count}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{cat.description}</p>
                  </div>
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {isExpanded && (
                <div className="p-4 pt-0 space-y-2 border-t border-slate-800/50">
                  {cat.items.length === 0 ? (
                    <p className="text-xs text-slate-500 italic py-2">No skills in this category.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                      {cat.items.map((item, i) => (
                        <div key={i} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                            <span>{item.skill}</span>
                            <span className="text-[10px] text-slate-500">{item.importance}</span>
                          </div>
                          {item.matchedResumeText ? (
                            <p className="text-[11px] italic text-slate-400 bg-slate-900/80 p-2 rounded border-l border-blue-500/50 line-clamp-2">
                              "{item.matchedResumeText}"
                            </p>
                          ) : (
                            <p className="text-[11px] text-slate-500 italic">No supporting project or bullet citation found.</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
