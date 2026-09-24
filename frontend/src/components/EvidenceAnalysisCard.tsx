import React, { useState } from 'react';
import { SkillAnalysisItem } from '../types';
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
      color: '#16A34A',
      bgColor: 'bg-[#DCFCE7]',
      textColor: 'text-[#16A34A]',
      icon: ShieldCheck,
      description: 'Skills demonstrated in projects or work history with quantified outcomes, metrics, or pipeline scale.',
      items: strong
    },
    {
      level: 'Moderate',
      count: moderate.length,
      color: '#F97316',
      bgColor: 'bg-[#FFF3E8]',
      textColor: 'text-[#F97316]',
      icon: ShieldAlert,
      description: 'Demonstrated in project or coursework context, but lacks production scale metrics or architectural depth.',
      items: moderate
    },
    {
      level: 'Weak',
      count: weak.length,
      color: '#D97706',
      bgColor: 'bg-[#FEF3C7]',
      textColor: 'text-[#D97706]',
      icon: AlertCircle,
      description: 'Mentioned only in a keyword or skills list without implementation context. At risk in technical screens.',
      items: weak
    },
    {
      level: 'Not Demonstrated',
      count: notDemonstrated.length,
      color: '#DC2626',
      bgColor: 'bg-[#FEE2E2]',
      textColor: 'text-[#DC2626]',
      icon: HelpCircle,
      description: 'Required by the target job description but entirely absent from your current profile.',
      items: notDemonstrated
    }
  ];

  return (
    <div className="space-y-4">
      {/* Evidence Strength Distribution Bar */}
      <div className="p-5 rounded-2xl border border-[#E7E5E4] bg-white shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#1C1917]">Evidence Quality Distribution</h3>
          <span className="text-xs text-[#78716C]">{skills.length} Evaluated Competencies</span>
        </div>

        {/* Multi-segment Bar */}
        <div className="h-3 w-full rounded-full bg-[#E7E5E4] overflow-hidden flex">
          {strong.length > 0 && (
            <div
              style={{ width: `${(strong.length / skills.length) * 100}%` }}
              className="bg-[#16A34A] h-full transition-all duration-500"
              title={`Strong: ${strong.length}`}
            />
          )}
          {moderate.length > 0 && (
            <div
              style={{ width: `${(moderate.length / skills.length) * 100}%` }}
              className="bg-[#F97316] h-full transition-all duration-500"
              title={`Moderate: ${moderate.length}`}
            />
          )}
          {weak.length > 0 && (
            <div
              style={{ width: `${(weak.length / skills.length) * 100}%` }}
              className="bg-[#D97706] h-full transition-all duration-500"
              title={`Weak: ${weak.length}`}
            />
          )}
          {notDemonstrated.length > 0 && (
            <div
              style={{ width: `${(notDemonstrated.length / skills.length) * 100}%` }}
              className="bg-[#DC2626] h-full transition-all duration-500"
              title={`Not Demonstrated: ${notDemonstrated.length}`}
            />
          )}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
          <div className="flex items-center gap-2 text-[#1C1917]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] shrink-0" />
            <span>Strong ({strong.length})</span>
          </div>
          <div className="flex items-center gap-2 text-[#1C1917]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F97316] shrink-0" />
            <span>Moderate ({moderate.length})</span>
          </div>
          <div className="flex items-center gap-2 text-[#1C1917]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D97706] shrink-0" />
            <span>Weak ({weak.length})</span>
          </div>
          <div className="flex items-center gap-2 text-[#1C1917]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626] shrink-0" />
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
              className="rounded-2xl border border-[#E7E5E4] bg-white overflow-hidden transition shadow-sm"
            >
              <button
                onClick={() => setExpandedLevel(isExpanded ? null : cat.level)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-[#FAFAFA] transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${cat.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${cat.textColor}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#1C1917]">{cat.level} Evidence</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F5F5F4] text-[#1C1917] border border-[#E7E5E4]">
                        {cat.count}
                      </span>
                    </div>
                    <p className="text-xs text-[#78716C] mt-0.5">{cat.description}</p>
                  </div>
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-[#78716C]" /> : <ChevronDown className="w-4 h-4 text-[#78716C]" />}
              </button>

              {isExpanded && (
                <div className="p-4 pt-0 space-y-2 border-t border-[#E7E5E4]">
                  {cat.items.length === 0 ? (
                    <p className="text-xs text-[#78716C] italic py-2">No skills in this category.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                      {cat.items.map((item, i) => (
                        <div key={i} className="p-3 rounded-xl bg-[#FAFAFA] border border-[#E7E5E4] space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-semibold text-[#1C1917]">
                            <span>{item.skill}</span>
                            <span className="text-[10px] text-[#78716C]">{item.importance}</span>
                          </div>
                          {item.matchedResumeText ? (
                            <p className="text-[11px] italic text-[#1C1917] bg-white p-2.5 rounded-lg border-l-2 border-[#F97316] line-clamp-2">
                              "{item.matchedResumeText}"
                            </p>
                          ) : (
                            <p className="text-[11px] text-[#78716C] italic">No supporting project or bullet citation found.</p>
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
