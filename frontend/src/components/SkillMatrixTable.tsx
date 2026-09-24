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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#16A34A] border border-[#16A34A]/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Matched
          </span>
        );
      case 'Missing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FEE2E2] text-[#DC2626] border border-[#DC2626]/20">
            <XCircle className="w-3.5 h-3.5" />
            Missing
          </span>
        );
      case 'Weak':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#D97706] border border-[#D97706]/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            Weak Evidence
          </span>
        );
    }
  };

  const getImportanceBadge = (importance: ImportanceLevel) => {
    switch (importance) {
      case 'Critical':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#FEE2E2] text-[#DC2626] border border-[#DC2626]/30">Critical</span>;
      case 'High':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#FFF3E8] text-[#F97316] border border-[#F97316]/30">High</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#FAFAFA] text-[#78716C] border border-[#E7E5E4]">Medium</span>;
      case 'Optional':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#F5F5F4] text-[#A8A29E] border border-[#E7E5E4]">Optional</span>;
    }
  };

  const getEvidenceBadge = (level: EvidenceLevel) => {
    switch (level) {
      case 'Strong':
        return <span className="text-[#16A34A] font-semibold text-xs">Strong (Projects & Impact)</span>;
      case 'Moderate':
        return <span className="text-[#F97316] font-medium text-xs">Moderate (Coursework / Context)</span>;
      case 'Weak':
        return <span className="text-[#D97706] font-medium text-xs">Weak (Listed Only)</span>;
      case 'Not Demonstrated':
        return <span className="text-[#78716C] font-normal text-xs">Not Demonstrated</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#78716C]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skill name, category, or reason..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-[#E7E5E4] text-xs text-[#1C1917] placeholder-[#78716C] focus:outline-none focus:border-[#F97316] transition shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-[#E7E5E4] text-xs text-[#1C1917] shadow-sm">
            <Filter className="w-3.5 h-3.5 text-[#78716C]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs text-[#1C1917] focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="Matched">Matched</option>
              <option value="Missing">Missing</option>
              <option value="Weak">Weak Evidence</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-[#E7E5E4] text-xs text-[#1C1917] shadow-sm">
            <select
              value={importanceFilter}
              onChange={(e) => setImportanceFilter(e.target.value)}
              className="bg-transparent text-xs text-[#1C1917] focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Importance</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-[#E7E5E4] bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E7E5E4] bg-[#FAFAFA] text-[11px] uppercase tracking-wider text-[#78716C] font-bold">
                <th className="py-3.5 px-4">Skill</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Importance</th>
                <th className="py-3.5 px-4 hidden md:table-cell">Resume Evidence</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E5E4] text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#78716C]">
                    No skills matched the current search and filters.
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => (
                  <tr
                    key={idx}
                    onClick={() => onSelectSkill(item)}
                    className="hover:bg-[#FAFAFA] transition cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-semibold text-[#1C1917] flex items-center gap-2">
                      <span>{item.skill}</span>
                      {item.category && (
                        <span className="hidden sm:inline text-[10px] text-[#78716C] font-normal">
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
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#F97316] group-hover:text-[#EA580C] transition cursor-pointer"
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
