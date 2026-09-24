import React, { useState } from 'react';
import { SkillAnalysisItem } from '../types';
import {
  Sparkles, CheckCircle2, AlertTriangle, XCircle,
  Plus
} from 'lucide-react';

interface SkillIntelligenceProps {
  skills: SkillAnalysisItem[];
  onSelectSkill: (skill: SkillAnalysisItem) => void;
  onAddToRoadmap?: (skillName: string) => void;
}

export const SkillIntelligence: React.FC<SkillIntelligenceProps> = ({
  skills,
  onSelectSkill,
  onAddToRoadmap
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [mobileTab, setMobileTab] = useState<'strong' | 'improving' | 'needs_attention'>('strong');

  // Filter skills
  const filtered = skills.filter(s => {
    if (selectedCategory === 'ALL') return true;
    return s.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  // Categorize
  const strong = filtered.filter(s => s.status === 'Matched' && (s.evidenceLevel === 'Strong' || s.evidenceLevel === 'Moderate'));
  const improving = filtered.filter(s => s.status === 'Weak');
  const needsAttention = filtered.filter(s => s.status === 'Missing');

  const categories = ['ALL', 'Programming', 'AI / ML', 'Data Engineering', 'Backend', 'DevOps', 'Cloud', 'Architecture'];

  const renderSkillChip = (skill: SkillAnalysisItem, columnType: 'strong' | 'improving' | 'needs_attention') => {
    return (
      <div
        key={skill.skill}
        onClick={() => onSelectSkill(skill)}
        className="p-3.5 rounded-2xl bg-[#FAFAFA] hover:bg-white border border-[#E7E5E4] hover:border-[#F97316]/50 transition cursor-pointer space-y-2 group shadow-sm"
      >
        <div className="flex items-center justify-between">
          <span className="font-bold text-xs text-[#1C1917] group-hover:text-[#F97316] transition">
            {skill.skill}
          </span>
          <span className="text-[10px] text-[#78716C] font-semibold px-2 py-0.5 rounded bg-[#F5F5F4] border border-[#E7E5E4]">
            {skill.importance}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#78716C]">
          <span className="truncate max-w-[150px]">{skill.category || 'Competency'}</span>
          <span className={`font-semibold ${
            skill.evidenceLevel === 'Strong' ? 'text-[#16A34A]' :
            skill.evidenceLevel === 'Moderate' ? 'text-[#F97316]' :
            skill.evidenceLevel === 'Weak' ? 'text-[#D97706]' : 'text-[#78716C]'
          }`}>
            {skill.evidenceLevel}
          </span>
        </div>

        {columnType === 'needs_attention' && onAddToRoadmap && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToRoadmap(skill.skill);
            }}
            className="w-full mt-1 py-1.5 px-2 rounded-xl bg-[#FFF3E8] hover:bg-[#F97316] text-[#F97316] hover:text-white text-[11px] font-bold flex items-center justify-center gap-1 transition border border-[#F97316]/20 cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Add to Career Roadmap</span>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 rounded-3xl border border-[#E7E5E4] bg-white space-y-6 shadow-sm">
      
      {/* Header & Filter/Sort Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E5E4]">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#F97316] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 fill-[#F97316]" />
            <span>Skill Intelligence Grid</span>
          </span>
          <h3 className="text-base font-bold text-[#1C1917] mt-0.5">Competency Distribution</h3>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 max-w-full">
          {categories.slice(0, 5).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#F97316] text-white shadow-sm'
                  : 'bg-[#FAFAFA] text-[#78716C] hover:text-[#1C1917] border border-[#E7E5E4]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="flex md:hidden items-center justify-around bg-[#FAFAFA] p-1 rounded-2xl border border-[#E7E5E4] text-xs">
        <button
          onClick={() => setMobileTab('strong')}
          className={`flex-1 py-1.5 rounded-xl font-bold transition ${mobileTab === 'strong' ? 'bg-[#DCFCE7] text-[#16A34A]' : 'text-[#78716C]'}`}
        >
          Strong ({strong.length})
        </button>
        <button
          onClick={() => setMobileTab('improving')}
          className={`flex-1 py-1.5 rounded-xl font-bold transition ${mobileTab === 'improving' ? 'bg-[#FEF3C7] text-[#D97706]' : 'text-[#78716C]'}`}
        >
          Improving ({improving.length})
        </button>
        <button
          onClick={() => setMobileTab('needs_attention')}
          className={`flex-1 py-1.5 rounded-xl font-bold transition ${mobileTab === 'needs_attention' ? 'bg-[#FEE2E2] text-[#DC2626]' : 'text-[#78716C]'}`}
        >
          Gaps ({needsAttention.length})
        </button>
      </div>

      {/* 3 Columns Grid (Desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Column 1: Strong */}
        <div className={`space-y-3 ${mobileTab !== 'strong' ? 'hidden md:block' : ''}`}>
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-[#16A34A] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>STRONG EVIDENCE</span>
            </span>
            <span className="text-[10px] font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full border border-[#16A34A]/20">
              {strong.length} Verified
            </span>
          </div>

          <div className="space-y-2">
            {strong.map(s => renderSkillChip(s, 'strong'))}
          </div>
        </div>

        {/* Column 2: Improving */}
        <div className={`space-y-3 ${mobileTab !== 'improving' ? 'hidden md:block' : ''}`}>
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-[#D97706] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>IMPROVING / WEAK</span>
            </span>
            <span className="text-[10px] font-bold text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded-full border border-[#D97706]/20">
              {improving.length} Needs Scale
            </span>
          </div>

          <div className="space-y-2">
            {improving.map(s => renderSkillChip(s, 'improving'))}
          </div>
        </div>

        {/* Column 3: Needs Attention */}
        <div className={`space-y-3 ${mobileTab !== 'needs_attention' ? 'hidden md:block' : ''}`}>
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-[#DC2626] flex items-center gap-1.5">
              <XCircle className="w-4 h-4" />
              <span>NEEDS ATTENTION (GAPS)</span>
            </span>
            <span className="text-[10px] font-bold text-[#DC2626] bg-[#FEE2E2] px-2 py-0.5 rounded-full border border-[#DC2626]/20">
              {needsAttention.length} Missing
            </span>
          </div>

          <div className="space-y-2">
            {needsAttention.map(s => renderSkillChip(s, 'needs_attention'))}
          </div>
        </div>
      </div>
    </div>
  );
};
