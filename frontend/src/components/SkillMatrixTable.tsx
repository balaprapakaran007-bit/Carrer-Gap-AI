import React, { useState } from 'react';
import { SkillAnalysisItem, SkillStatus, ImportanceLevel, EvidenceLevel } from '../types';
import { Search, CheckCircle2, XCircle, AlertTriangle, ChevronRight, Filter } from 'lucide-react';

interface SkillMatrixTableProps {
  skills: SkillAnalysisItem[];
  onSelectSkill: (skill: SkillAnalysisItem) => void;
}

export const SkillMatrixTable: React.FC<SkillMatrixTableProps> = ({ skills, onSelectSkill }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [importanceFilter, setImportanceFilter] = useState<string>('ALL');

  const filtered = skills.filter((item) => {
    const matchSearch = item.skill.toLowerCase().includes(search.toLowerCase()) ||
      item.whyItMatters.toLowerCase().includes(search.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(search.toLowerCase()));
    
    const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchImportance = importanceFilter === 'ALL' || item.importance === importanceFilter;

    return matchSearch && matchStatus && matchImportance;
  });

  const getStatusBadge = (status: SkillStatus) => {
    switch (status) {
      case 'Matched':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Matched
          </span>
        );
      case 'Missing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" />
            Missing
          </span>
        );
      case 'Weak':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            Weak Evidence
          </span>
        );
    }
  };

  const getImportanceBadge = (importance: ImportanceLevel) => {
    switch (importance) {
      case 'Critical':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-500/15 text-red-300 border border-red-500/30">Critical</span>;
      case 'High':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-orange-500/15 text-orange-300 border border-orange-500/30">High</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-500/15 text-blue-300 border border-blue-500/30">Medium</span>;
      case 'Optional':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-700/40 text-slate-400 border border-slate-700">Optional</span>;
    }
  };

  const getEvidenceBadge = (level: EvidenceLevel) => {
    switch (level) {
      case 'Strong':
        return <span className="text-emerald-400 font-semibold text-xs">Strong (Projects & Impact)</span>;
      case 'Moderate':
        return <span className="text-blue-400 font-medium text-xs">Moderate (Coursework / Context)</span>;
      case 'Weak':
        return <span className="text-amber-400 font-medium text-xs">Weak (Listed Only)</span>;
      case 'Not Demonstrated':
        return <span className="text-slate-500 font-normal text-xs">Not Demonstrated</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skill name, category, or reason..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Statuses</option>
              <option value="Matched" className="bg-slate-900">Matched</option>
              <option value="Missing" className="bg-slate-900">Missing</option>
              <option value="Weak" className="bg-slate-900">Weak Evidence</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <select
              value={importanceFilter}
              onChange={(e) => setImportanceFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Importance</option>
              <option value="Critical" className="bg-slate-900">Critical</option>
              <option value="High" className="bg-slate-900">High</option>
              <option value="Medium" className="bg-slate-900">Medium</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table / Card Container */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                <th className="py-3.5 px-4">Skill</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Importance</th>
                <th className="py-3.5 px-4 hidden md:table-cell">Resume Evidence</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No skills matched the current search and filters.
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => (
                  <tr
                    key={idx}
                    onClick={() => onSelectSkill(item)}
                    className="hover:bg-blue-600/5 transition cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-semibold text-slate-100 flex items-center gap-2">
                      <span>{item.skill}</span>
                      {item.category && (
                        <span className="hidden sm:inline text-[10px] text-slate-500 font-normal">
                          • {item.category}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="py-3.5 px-4">
                      {getImportanceBadge(item.importance)}
                    </td>
                    <td className="py-3.5 px-4 hidden md:table-cell">
                      {getEvidenceBadge(item.evidenceLevel)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => { e.stopPropagation(); onSelectSkill(item); }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 group-hover:text-blue-300 transition"
                      >
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
