import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../context/DashboardContext';
import { useTheme, PRESET_THEMES } from '../context/ThemeContext';
import {
  Search, Sparkles, LayoutDashboard, MapPin, Mic, Layers, BarChart3,
  Moon, Sun, Palette, ArrowRight, FileText, X, Check
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
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      {/* Palette Box */}
      <div
        onKeyDown={handleKeyDown}
        className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[75vh]"
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-900/50">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIdx(0); }}
            placeholder="Type a command or search (e.g. analyze, theme, roadmap)..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-slate-400 border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No matching commands or pages found.
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
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600/15 text-blue-300 border border-blue-500/30'
                      : 'text-slate-300 hover:bg-slate-900/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold">{item.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium px-2 py-0.5 rounded bg-slate-900">
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span>Use ↑↓ to navigate</span>
            <span>•</span>
            <span>↵ to select</span>
          </div>
          <span>CareerGap AI Command Center</span>
        </div>
      </div>
    </div>
  );
};
