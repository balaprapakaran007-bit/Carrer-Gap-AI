import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../context/DashboardContext';
import { useTheme, PRESET_THEMES } from '../context/ThemeContext';
import {
  Search, Sparkles, LayoutDashboard, MapPin, Mic, Layers, BarChart3,
  Moon, Sun, Palette
} from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, setIsCommandPaletteOpen } = useDashboard();
  const { theme, setTheme, mode, setMode } = useTheme();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);

  if (!isCommandPaletteOpen) return null;

  const actions = [
    // Navigation
    { id: 'nav-dashboard', label: 'Go to Dashboard', category: 'Navigation', icon: LayoutDashboard, action: () => navigate('/dashboard') },
    { id: 'nav-analyze', label: 'Analyze New Job Description', category: 'Navigation', icon: Sparkles, action: () => navigate('/analyze') },
    { id: 'nav-roadmap', label: 'Open Career Roadmap', category: 'Navigation', icon: MapPin, action: () => navigate('/roadmaps/demo-analysis-ml-01') },
    { id: 'nav-interview', label: 'Launch Mock Interview Simulator', category: 'Navigation', icon: Mic, action: () => navigate('/interview/demo-analysis-ml-01') },
    { id: 'nav-multicompare', label: 'Multi-Job Compatibility Comparison', category: 'Navigation', icon: Layers, action: () => navigate('/multi-compare') },
    { id: 'nav-benchmarks', label: 'View Peer Role Benchmarks', category: 'Navigation', icon: BarChart3, action: () => navigate('/benchmarks') },
    { id: 'nav-appearance', label: 'Customize Theme & Appearance', category: 'Settings', icon: Palette, action: () => navigate('/appearance') },
    
    // Quick Actions
    { id: 'act-mode', label: `Toggle Mode (Current: ${mode})`, category: 'Actions', icon: mode === 'dark' ? Sun : Moon, action: () => setMode(mode === 'dark' ? 'light' : 'dark') },
    
    // Quick Themes
    ...PRESET_THEMES.map(t => ({
      id: `theme-${t.id}`,
      label: `Switch Theme to ${t.name}`,
      category: 'Themes',
      icon: Palette,
      action: () => setTheme(t.id)
    }))
  ];

  const filtered = actions.filter(a =>
    a.label.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (idx: number) => {
    if (filtered[idx]) {
      filtered[idx].action();
      setIsCommandPaletteOpen(false);
      setQuery('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx(prev => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx(prev => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSelect(selectedIdx);
    } else if (e.key === 'Escape') {
      setIsCommandPaletteOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div
        onClick={() => setIsCommandPaletteOpen(false)}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
      />

      {/* Palette Box */}
      <div
        onKeyDown={handleKeyDown}
        className="relative w-full max-w-xl rounded-2xl border border-[#E7E5E4] bg-white shadow-2xl overflow-hidden z-10 flex flex-col max-h-[75vh]"
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#E7E5E4] bg-[#FAFAFA]">
          <Search className="w-5 h-5 text-[#78716C] mr-3 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIdx(0); }}
            placeholder="Type a command or search (e.g. analyze, theme, roadmap)..."
            className="w-full bg-transparent text-sm text-[#1C1917] placeholder-[#78716C] focus:outline-none"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono rounded bg-white text-[#78716C] border border-[#E7E5E4]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#78716C]">
              No commands matching "{query}"
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIdx;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(idx)}
                  onMouseEnter={() => setSelectedIdx(idx)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition cursor-pointer ${
                    isSelected
                      ? 'bg-[#FFF3E8] text-[#F97316] font-semibold border border-[#F97316]/30'
                      : 'text-[#1C1917] hover:bg-[#FAFAFA]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#F97316]' : 'text-[#78716C]'}`} />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[10px] text-[#78716C] capitalize bg-[#FAFAFA] px-2 py-0.5 rounded border border-[#E7E5E4]">
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-[#E7E5E4] bg-[#FAFAFA] flex items-center justify-between text-[11px] text-[#78716C]">
          <span>Navigate with ↑ ↓ and Enter</span>
          <span>CareerGap AI Quick Actions</span>
        </div>
      </div>
    </div>
  );
};
