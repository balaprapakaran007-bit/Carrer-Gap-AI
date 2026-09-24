import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';

export type ThemePreset = 'ocean' | 'emerald' | 'violet' | 'sunset' | 'rose' | 'cyan' | 'indigo' | 'monochrome' | 'custom';
export type ThemeMode = 'light' | 'dark' | 'system';
export type DensityMode = 'comfortable' | 'compact';
export type MotionMode = 'full' | 'reduced';
export type ContrastMode = 'standard' | 'high';

export interface CustomTheme {
  id: string;
  name: string;
  hex: string;
  primary: string;
  h: number;
  s: number;
  l: number;
}

export const PRESET_THEMES: { id: ThemePreset; name: string; hex: string; desc: string }[] = [
  { id: 'indigo', name: 'Indigo', hex: '#4F46E5', desc: 'Deep focus & AI intelligence (Default)' },
  { id: 'ocean', name: 'Ocean Blue', hex: '#2563EB', desc: 'Trust & analytical clarity' },
  { id: 'emerald', name: 'Emerald', hex: '#059669', desc: 'Growth & momentum (WCAG AA)' },
  { id: 'violet', name: 'Violet', hex: '#7C3AED', desc: 'Creative intelligence' },
  { id: 'sunset', name: 'Sunset Orange', hex: '#EA580C', desc: 'High energy & drive (WCAG AA)' },
  { id: 'rose', name: 'Rose', hex: '#E11D48', desc: 'Bold ambition' },
  { id: 'cyan', name: 'Cyan', hex: '#0891B2', desc: 'Precision & tech focus (WCAG AA)' },
  { id: 'monochrome', name: 'Monochrome', hex: '#475569', desc: 'Minimalist slate' },
];

interface ThemeContextType {
  theme: ThemePreset;
  mode: ThemeMode;
  density: DensityMode;
  motion: MotionMode;
  contrast: ContrastMode;
  adaptiveAccent: boolean;
  customHex: string;
  customThemes: CustomTheme[];
  setTheme: (theme: ThemePreset) => void;
  setMode: (mode: ThemeMode) => void;
  setDensity: (density: DensityMode) => void;
  setMotion: (motion: MotionMode) => void;
  setContrast: (contrast: ContrastMode) => void;
  setAdaptiveAccent: (val: boolean) => void;
  setCustomHex: (hex: string) => void;
  applyCustomAccent: (hex: string) => void;
  saveCustomTheme: (themeOrName: { id?: string; name: string; primary?: string; hex?: string } | string, maybeHex?: string) => void;
  deleteCustomTheme: (id: string) => void;
  activeHex: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper: Hex to HSL
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('');
  }
  const num = parseInt(c, 16);
  const r = (num >> 16) / 255;
  const g = ((num >> 8) & 0x00ff) / 255;
  const b = (num & 0x0000ff) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h = Math.round(h * 60);
  }
  return { h, s: Math.round(s * 100), l: Math.round(l * 100) };
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [theme, setThemeState] = useState<ThemePreset>(() => {
    return (localStorage.getItem('cg_theme') as ThemePreset) || 'indigo';
  });
  const [mode, setModeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem('cg_mode') as ThemeMode) || 'dark';
  });
  const [density, setDensityState] = useState<DensityMode>(() => {
    return (localStorage.getItem('cg_density') as DensityMode) || 'comfortable';
  });
  const [motion, setMotionState] = useState<MotionMode>(() => {
    return (localStorage.getItem('cg_motion') as MotionMode) || 'full';
  });
  const [contrast, setContrastState] = useState<ContrastMode>(() => {
    return (localStorage.getItem('cg_contrast') as ContrastMode) || 'standard';
  });
  const [adaptiveAccent, setAdaptiveAccentState] = useState<boolean>(() => {
    return localStorage.getItem('cg_adaptive_accent') === 'true';
  });
  const [customHex, setCustomHexState] = useState<string>(() => {
    return localStorage.getItem('cg_custom_hex') || '#3B82F6';
  });
  const [customThemes, setCustomThemes] = useState<CustomTheme[]>(() => {
    try {
      const saved = localStorage.getItem('cg_custom_themes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Apply CSS attributes to document.documentElement
  useEffect(() => {
    const root = document.documentElement;

    // Apply Mode (Light/Dark/System)
    let effectiveMode = mode;
    if (mode === 'system') {
      effectiveMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    root.setAttribute('data-mode', effectiveMode);

    // Apply Density, Contrast, Motion
    root.setAttribute('data-density', density);
    root.setAttribute('data-contrast', contrast);
    root.setAttribute('data-motion', motion);

    // Apply Theme
    root.setAttribute('data-theme', theme);

    if (theme === 'custom') {
      const hsl = hexToHsl(customHex);
      root.style.setProperty('--primary-h', String(hsl.h));
      root.style.setProperty('--primary-s', `${hsl.s}%`);
      root.style.setProperty('--primary-l', `${hsl.l}%`);
    } else {
      root.style.removeProperty('--primary-h');
      root.style.removeProperty('--primary-s');
      root.style.removeProperty('--primary-l');
    }

    // Adaptive time-of-day subtle shift
    if (adaptiveAccent && theme !== 'custom') {
      const hour = new Date().getHours();
      if (hour >= 18 || hour < 6) {
        root.style.setProperty('--primary-s', '80%');
      }
    }
  }, [theme, mode, density, motion, contrast, adaptiveAccent, customHex]);

  const syncToFirestore = (updatedPrefs: any) => {
    if (user?.uid && user.uid !== 'demo_user') {
      const userRef = doc(db, 'users', user.uid);
      setDoc(userRef, { preferences: updatedPrefs }, { merge: true }).catch(() => {});
    }
  };

  const setTheme = (val: ThemePreset) => {
    setThemeState(val);
    localStorage.setItem('cg_theme', val);
    syncToFirestore({ theme: val });
  };

  const setMode = (val: ThemeMode) => {
    setModeState(val);
    localStorage.setItem('cg_mode', val);
    syncToFirestore({ mode: val });
  };

  const setDensity = (val: DensityMode) => {
    setDensityState(val);
    localStorage.setItem('cg_density', val);
    syncToFirestore({ density: val });
  };

  const setMotion = (val: MotionMode) => {
    setMotionState(val);
    localStorage.setItem('cg_motion', val);
    syncToFirestore({ motion: val });
  };

  const setContrast = (val: ContrastMode) => {
    setContrastState(val);
    localStorage.setItem('cg_contrast', val);
    syncToFirestore({ contrast: val });
  };

  const setAdaptiveAccent = (val: boolean) => {
    setAdaptiveAccentState(val);
    localStorage.setItem('cg_adaptive_accent', String(val));
  };

  const setCustomHex = (hex: string) => {
    setCustomHexState(hex);
    localStorage.setItem('cg_custom_hex', hex);
    setTheme('custom');
  };

  const applyCustomAccent = (hex: string) => {
    setCustomHex(hex);
  };

  const saveCustomTheme = (themeOrName: any, maybeHex?: string) => {
    let name = '';
    let hex = '';
    if (typeof themeOrName === 'object' && themeOrName !== null) {
      name = themeOrName.name || 'Custom Theme';
      hex = themeOrName.primary || themeOrName.hex || '#3B82F6';
    } else {
      name = String(themeOrName);
      hex = maybeHex || '#3B82F6';
    }

    const hsl = hexToHsl(hex);
    const newTheme: CustomTheme = {
      id: 'theme_' + Date.now(),
      name,
      hex,
      primary: hex,
      ...hsl
    };
    const updated = [...customThemes, newTheme];
    setCustomThemes(updated);
    localStorage.setItem('cg_custom_themes', JSON.stringify(updated));
    setCustomHex(hex);
  };

  const deleteCustomTheme = (id: string) => {
    const updated = customThemes.filter(t => t.id !== id);
    setCustomThemes(updated);
    localStorage.setItem('cg_custom_themes', JSON.stringify(updated));
    if (theme === 'custom') {
      setTheme('ocean');
    }
  };

  const activePreset = PRESET_THEMES.find(t => t.id === theme);
  const activeHex = theme === 'custom' ? customHex : (activePreset?.hex || '#2563EB');

  return (
    <ThemeContext.Provider value={{
      theme, mode, density, motion, contrast, adaptiveAccent, customHex, customThemes,
      setTheme, setMode, setDensity, setMotion, setContrast, setAdaptiveAccent,
      setCustomHex, applyCustomAccent, saveCustomTheme, deleteCustomTheme, activeHex
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
};
