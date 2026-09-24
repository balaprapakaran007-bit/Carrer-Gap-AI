import React, { useState } from 'react';
import { SkillAnalysisItem } from '../types';
import {
  Sparkles, CheckCircle2, AlertTriangle, XCircle, Filter, ArrowUpDown,
  Plus, Layers, ShieldCheck, ChevronRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

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
  const { activeHex } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'relevance' | 'evidence' | 'alpha'>('relevance');
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
        className="p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition cursor-pointer space-y-2 group shadow-sm"
      >
        <div className="flex items-center justify-between">
          <span className="font-bold text-xs text-white group-hover:text-blue-400 transition">
            {skill.skill}
          </span>
          <span className="text-[10px] text-slate-500 font-semibold px-2 py-0.5 rounded bg-slate-900">
            {skill.importance}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="truncate max-w-[150px]">{skill.category || 'Competency'}</span>
          <span className={`font-semibold ${
            skill.evidenceLevel === 'Strong' ? 'text-emerald-400' :
            skill.evidenceLevel === 'Moderate' ? 'text-blue-400' :
            skill.evidenceLevel === 'Weak' ? 'text-amber-400' : 'text-slate-500'
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
            className="w-full mt-1 py-1.5 px-2 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 text-[11px] font-bold flex items-center justify-center gap-1 transition"
          >
            <Plus className="w-3 h-3" />
            <span>Add to Career Roadmap</span>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md space-y-6 shadow-xl">
      
      {/* Header & Filter/Sort Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/60">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            <span>Skill Intelligence Grid</span>
          </span>
          <h3 className="text-base font-bold text-white mt-0.5">Competency Distribution</h3>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 max-w-full">
          {categories.slice(0, 5).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="flex md:hidden items-center justify-around bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
        <button
          onClick={() => setMobileTab('strong')}
          className={`flex-1 py-1.5 rounded-xl font-bold transition ${mobileTab === 'strong' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400'}`}
        >
          Strong ({strong.length})
        </button>
        <button
          onClick={() => setMobileTab('improving')}
          className={`flex-1 py-1.5 rounded-xl font-bold transition ${mobileTab === 'improving' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400'}`}
        >
          Improving ({improving.length})
        </button>
        <button
          onClick={() => setMobileTab('needs_attention')}
          className={`flex-1 py-1.5 rounded-xl font-bold transition ${mobileTab === 'needs_attention' ? 'bg-rose-500/20 text-rose-300' : 'text-slate-400'}`}
        >
          Gaps ({needsAttention.length})
        </button>
      </div>

      {/* 3 Columns Grid (Desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Column 1: Strong */}
        <div className={`space-y-3 ${mobileTab !== 'strong' ? 'hidden md:block' : ''}`}>
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>STRONG EVIDENCE</span>
            </span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
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
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>IMPROVING / WEAK</span>
            </span>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
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
            <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
              <XCircle className="w-4 h-4" />
              <span>NEEDS ATTENTION (GAPS)</span>
            </span>
            <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full">
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
