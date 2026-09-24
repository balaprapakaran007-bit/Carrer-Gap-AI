import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useDashboard } from '../context/DashboardContext';
import {
  Palette,
  Sun,
  Moon,
  Monitor,
  Sparkles,
  Check,
  ShieldAlert,
  Save,
  Trash2,
  Play
} from 'lucide-react';

export const AppearancePage: React.FC = () => {
  const {
    theme,
    setTheme,
    mode,
    setMode,
    density,
    setDensity,
    contrast,
    setContrast,
    motion,
    setMotion,
    adaptiveAccent,
    setAdaptiveAccent,
    customThemes,
    saveCustomTheme,
    deleteCustomTheme,
    applyCustomAccent
  } = useTheme();

  const { setHasSeenTour } = useDashboard();

  const [activeTab, setActiveTab] = useState<'presets' | 'advanced'>('presets');
  const [customHex, setCustomHex] = useState('#2563EB');
  const [customName, setCustomName] = useState('My Custom Theme');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const presetThemes = [
    { id: 'ocean', name: 'Ocean Blue', color: '#2563EB', desc: 'Crisp, analytical modern blue' },
    { id: 'emerald', name: 'Emerald', color: '#10B981', desc: 'Fresh, growth-focused vibrant green' },
    { id: 'violet', name: 'Violet', color: '#7C3AED', desc: 'Deep, creative intelligence purple' },
    { id: 'sunset', name: 'Sunset Orange', color: '#F97316', desc: 'Energetic, high-impact warm orange' },
    { id: 'rose', name: 'Rose', color: '#E11D48', desc: 'Sleek, bold modern crimson' },
    { id: 'cyan', name: 'Cyan', color: '#06B6D4', desc: 'Electric, sharp tech cyan' },
    { id: 'indigo', name: 'Indigo', color: '#4F46E5', desc: 'Classic, refined engineering indigo' },
    { id: 'monochrome', name: 'Monochrome', color: '#64748B', desc: 'Minimalist, distraction-free slate' },
  ];

  const getLuminance = (hex: string) => {
    const c = hex.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16) / 255;
    const g = parseInt(c.substring(2, 4), 16) / 255;
    const b = parseInt(c.substring(4, 6), 16) / 255;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const isLowContrastInDark = getLuminance(customHex) < 0.15;
  const isLowContrastInLight = getLuminance(customHex) > 0.85;
  const contrastWarning = mode === 'dark' ? isLowContrastInDark : isLowContrastInLight;

  const handleCustomHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomHex(val);
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      applyCustomAccent(val);
    }
  };

  const handleSaveCustomTheme = () => {
    if (!customName.trim() || !/^#[0-9A-Fa-f]{6}$/.test(customHex)) return;
    saveCustomTheme(customName, customHex);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
          <Palette className="w-4 h-4 text-[var(--primary)]" />
          <span>System Personalization</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-main)] mt-1">
          Appearance & Themes
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
          Customize your accent color palette, interface density, and display behavior. Changes take effect immediately.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-px">
        <button
          onClick={() => setActiveTab('presets')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition border-b-2 -mb-px ${
            activeTab === 'presets'
              ? 'border-[var(--primary)] text-[var(--text-main)] bg-[var(--bg-surface)]'
              : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          Preset Themes & Mode
        </button>
        <button
          onClick={() => setActiveTab('advanced')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition border-b-2 -mb-px ${
            activeTab === 'advanced'
              ? 'border-[var(--primary)] text-[var(--text-main)] bg-[var(--bg-surface)]'
              : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          Custom Theme Builder & Accessibility
        </button>
      </div>

      {activeTab === 'presets' && (
        <div className="space-y-8">
          {/* Light / Dark / System Mode */}
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-sm space-y-4">
            <div>
              <h2 className="text-sm font-bold text-[var(--text-main)]">Interface Mode</h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Choose between light, dark, or automatic system sync.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'dark', label: 'Dark Mode', icon: Moon, desc: 'Deep sleek slate contrast' },
                { id: 'light', label: 'Light Mode', icon: Sun, desc: 'Clean, daylight-ready surface' },
                { id: 'system', label: 'System Sync', icon: Monitor, desc: 'Matches your OS preferences' },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = mode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id as any)}
                    className={`flex flex-col items-start p-4 rounded-xl border text-left transition ${
                      isSelected
                        ? 'border-[var(--primary)] bg-[var(--primary-muted)] shadow-sm'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'}`} />
                      {isSelected && <Check className="w-3.5 h-3.5 text-[var(--primary)]" />}
                    </div>
                    <span className="text-xs font-bold text-[var(--text-main)]">{m.label}</span>
                    <span className="text-[11px] text-[var(--text-muted)] mt-0.5">{m.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preset Color Themes */}
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-sm space-y-4">
            <div>
              <h2 className="text-sm font-bold text-[var(--text-main)]">Accent Color Palette</h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Select your signature career intelligence accent color. Applied across all charts, rings, and badges.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {presetThemes.map((t) => {
                const isSelected = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id as any)}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition ${
                      isSelected
                        ? 'border-[var(--primary)] bg-[var(--primary-muted)] shadow-md ring-1 ring-[var(--primary)]'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-white shadow-sm"
                      style={{ backgroundColor: t.color }}
                    >
                      {isSelected && <Check className="w-4 h-4" />}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[var(--text-main)]">{t.name}</span>
                      <span className="text-[10px] text-[var(--text-muted)] leading-tight mt-0.5">{t.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Density & Experience Toggles */}
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-sm space-y-4">
            <div>
              <h2 className="text-sm font-bold text-[var(--text-main)]">Layout Density</h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Adjust spacing and padding across tables and cards.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'comfortable', label: 'Comfortable', desc: 'Standard spacious layout with generous breathing room.' },
                { id: 'compact', label: 'Compact Mode', desc: 'Condensed table rows & tighter margins for power users.' },
              ].map((d) => {
                const isSelected = density === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => setDensity(d.id as any)}
                    className={`flex items-center justify-between p-4 rounded-xl border text-left transition ${
                      isSelected
                        ? 'border-[var(--primary)] bg-[var(--primary-muted)]'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-[var(--text-main)]">{d.label}</span>
                      <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{d.desc}</p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[var(--primary)] shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'advanced' && (
        <div className="space-y-8">
          {/* Custom Theme Builder */}
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-sm space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--primary)]" />
                <h2 className="text-sm font-bold text-[var(--text-main)]">Custom Theme Builder</h2>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Define your exact brand hex code. Our engine automatically generates the full accessible HSL lightness ramp.
              </p>
            </div>

            {/* Custom Color Input Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-muted)]">Theme Name</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g., Midnight Solar"
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-muted)]">Custom Accent Hex</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customHex}
                    onChange={handleCustomHexChange}
                    className="w-9 h-9 rounded-xl border border-[var(--border-subtle)] bg-transparent cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={customHex}
                    onChange={handleCustomHexChange}
                    placeholder="#2563EB"
                    className="flex-1 px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] text-xs font-mono text-[var(--text-main)] uppercase focus:outline-none focus:border-[var(--primary)]"
                  />
                  <button
                    onClick={handleSaveCustomTheme}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white shadow-sm transition hover:opacity-90"
                    style={{ backgroundColor: 'var(--primary)' }}
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            </div>

            {/* WCAG Auto-Contrast Guard */}
            {contrastWarning && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs">
                <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <div>
                  <span className="font-semibold">Auto-Contrast Guard Warning:</span> This hex may produce low contrast against your current background. Consider brightening or shifting saturation for WCAG AA compliance.
                </div>
              </div>
            )}

            {saveSuccess && (
              <div className="flex items-center gap-2 p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-medium">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Custom theme saved successfully!</span>
              </div>
            )}

            {/* Live Interactive Preview Panel */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Live Dynamic Preview
              </label>
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: customHex }}
                    />
                    <span className="text-xs font-bold text-[var(--text-main)]">
                      {customName} Preview
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                      style={{ backgroundColor: 'var(--primary-muted)', color: 'var(--primary)' }}
                    >
                      +14% Readiness
                    </span>
                  </div>

                  <button
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white shadow-sm"
                    style={{ backgroundColor: 'var(--primary)' }}
                  >
                    Primary Action Button
                  </button>
                </div>

                {/* Mini preview bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-[var(--text-muted)]">
                    <span>Target Match Progress</span>
                    <span className="font-bold text-[var(--text-main)]">82%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[var(--border-subtle)] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: '82%', backgroundColor: 'var(--primary)' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Saved Custom Themes List */}
            {customThemes.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
                <label className="text-xs font-semibold text-[var(--text-muted)]">Saved Custom Palettes</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {customThemes.map((ct) => (
                    <div
                      key={ct.id}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: ct.hex }} />
                        <span className="font-medium text-[var(--text-main)]">{ct.name}</span>
                        <span className="text-[10px] text-[var(--text-muted)] font-mono">{ct.hex}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => applyCustomAccent(ct.hex)}
                          className="px-2 py-0.5 rounded text-[11px] font-semibold text-[var(--primary)] hover:underline"
                        >
                          Apply
                        </button>
                        <button
                          onClick={() => deleteCustomTheme(ct.id)}
                          className="p-1 rounded text-[var(--text-muted)] hover:text-rose-400"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Accessibility & Motion */}
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-sm space-y-4">
            <div>
              <h2 className="text-sm font-bold text-[var(--text-main)]">Accessibility & Motion Controls</h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Customize motion sensitivity, high contrast mode, and adaptive lighting.
              </p>
            </div>

            <div className="space-y-3">
              {/* Reduced Motion Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
                <div>
                  <span className="text-xs font-bold text-[var(--text-main)]">Reduced Motion</span>
                  <p className="text-[11px] text-[var(--text-muted)]">Disable ring/bar animations and swap for instant transitions.</p>
                </div>
                <button
                  onClick={() => setMotion(motion === 'reduced' ? 'full' : 'reduced')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    motion === 'reduced'
                      ? 'bg-[var(--primary)] text-white'
                      : 'border border-[var(--border-subtle)] text-[var(--text-muted)]'
                  }`}
                >
                  {motion === 'reduced' ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              {/* High Contrast Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
                <div>
                  <span className="text-xs font-bold text-[var(--text-main)]">High Contrast Mode</span>
                  <p className="text-[11px] text-[var(--text-muted)]">Boost border and text visibility for enhanced legibility.</p>
                </div>
                <button
                  onClick={() => setContrast(contrast === 'high' ? 'standard' : 'high')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    contrast === 'high'
                      ? 'bg-[var(--primary)] text-white'
                      : 'border border-[var(--border-subtle)] text-[var(--text-muted)]'
                  }`}
                >
                  {contrast === 'high' ? 'Active' : 'Standard'}
                </button>
              </div>

              {/* Adaptive Accent Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
                <div>
                  <span className="text-xs font-bold text-[var(--text-main)]">Adaptive Time-of-Day Accent</span>
                  <p className="text-[11px] text-[var(--text-muted)]">Subtly warms accent tones in evening hours.</p>
                </div>
                <button
                  onClick={() => setAdaptiveAccent(!adaptiveAccent)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    adaptiveAccent
                      ? 'bg-[var(--primary)] text-white'
                      : 'border border-[var(--border-subtle)] text-[var(--text-muted)]'
                  }`}
                >
                  {adaptiveAccent ? 'On' : 'Off'}
                </button>
              </div>

              {/* Replay Onboarding Tour */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
                <div>
                  <span className="text-xs font-bold text-[var(--text-main)]">Platform Onboarding Tour</span>
                  <p className="text-[11px] text-[var(--text-muted)]">Re-launch the 4-step interactive guided coach marks.</p>
                </div>
                <button
                  onClick={() => setHasSeenTour(false)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-main)] hover:border-[var(--border-strong)] transition"
                >
                  <Play className="w-3 h-3 text-[var(--primary)]" />
                  <span>Replay Tour</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
