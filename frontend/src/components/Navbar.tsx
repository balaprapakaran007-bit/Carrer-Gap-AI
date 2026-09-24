import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useDashboard } from '../context/DashboardContext';
import { NotificationCenter } from './NotificationCenter';
import {
  Compass,
  Search,
  Bell,
  Palette,
  Sun,
  Moon,
  Monitor,
  User,
  LogOut,
  Sparkles,
  Menu,
  X,
  ChevronDown,
  Layers,
  Award
} from 'lucide-react';

export const Navbar: React.FC<{ toggleSidebar?: () => void; isSidebarOpen?: boolean }> = ({
  toggleSidebar,
  isSidebarOpen,
}) => {
  const { user, logout } = useAuth();
  const { theme, mode, setMode, setTheme } = useTheme();
  const { setIsCommandPaletteOpen, notifications } = useDashboard();
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setIsThemeMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const presetThemes = [
    { id: 'ocean', name: 'Ocean Blue', color: '#2563EB' },
    { id: 'emerald', name: 'Emerald', color: '#10B981' },
    { id: 'violet', name: 'Violet', color: '#7C3AED' },
    { id: 'sunset', name: 'Sunset Orange', color: '#F97316' },
    { id: 'rose', name: 'Rose', color: '#E11D48' },
    { id: 'cyan', name: 'Cyan', color: '#06B6D4' },
    { id: 'indigo', name: 'Indigo', color: '#4F46E5' },
    { id: 'monochrome', name: 'Monochrome', color: '#64748B' },
  ];

  return (
    <header 
      id="top-nav"
      className="sticky top-0 z-40 w-full border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/90 backdrop-blur-md transition-colors"
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Brand & Sidebar Mobile Toggle */}
        <div className="flex items-center gap-3">
          {user && toggleSidebar && (
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] transition"
              aria-label="Toggle navigation menu"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
            <div 
              className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md transition-transform group-hover:scale-105"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              <Compass className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-[var(--text-main)] leading-none">
                CareerGap <span style={{ color: 'var(--primary)' }}>AI</span>
              </span>
              <span className="text-[10px] text-[var(--text-muted)] font-medium hidden sm:inline leading-tight">
                Career Intelligence Engine
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Global Search Bar & Command Palette Trigger */}
        {user && (
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] text-xs text-[var(--text-muted)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-main)] shadow-sm"
              aria-label="Search jobs, skills, analyses"
            >
              <div className="flex items-center gap-2 truncate">
                <Search className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                <span className="truncate">Search jobs, skills, roadmaps...</span>
              </div>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[10px] font-mono text-[var(--text-muted)]">
                ⌘K
              </kbd>
            </button>
          </div>
        )}

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {/* Mobile search icon */}
              <button
                onClick={() => setIsCommandPaletteOpen(true)}
                className="md:hidden p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] transition"
                title="Search (⌘K)"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Notification Center Trigger */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] transition"
                  title="Notifications"
                  aria-label="View notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotificationsCount > 0 && (
                    <span 
                      className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full ring-2 ring-[var(--bg-surface)] animate-pulse"
                      style={{ backgroundColor: 'var(--primary)' }}
                    />
                  )}
                </button>
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 z-50">
                    <NotificationCenter isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
                  </div>
                )}
              </div>

              {/* Theme Selector Dropdown */}
              <div className="relative" ref={themeRef}>
                <button
                  onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                  className="flex items-center gap-1.5 p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] transition"
                  title="Theme & Colors"
                  aria-label="Customize theme"
                >
                  <div 
                    className="w-3.5 h-3.5 rounded-full ring-2 ring-[var(--border-subtle)]"
                    style={{ backgroundColor: 'var(--primary)' }}
                  />
                  <ChevronDown className="w-3 h-3 text-[var(--text-muted)]" />
                </button>

                {isThemeMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-surface)] p-3 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--border-subtle)]">
                      <span className="text-xs font-bold text-[var(--text-main)]">Theme Colors</span>
                      <Link 
                        to="/appearance" 
                        onClick={() => setIsThemeMenuOpen(false)}
                        className="text-[11px] font-semibold hover:underline"
                        style={{ color: 'var(--primary)' }}
                      >
                        More
                      </Link>
                    </div>

                    {/* Presets Grid */}
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      {presetThemes.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => {
                            setTheme(t.id as any);
                            setIsThemeMenuOpen(false);
                          }}
                          className={`h-7 rounded-lg flex items-center justify-center transition ${
                            theme === t.id ? 'ring-2 ring-[var(--text-main)] ring-offset-2 ring-offset-[var(--bg-surface)]' : 'hover:scale-105'
                          }`}
                          style={{ backgroundColor: t.color }}
                          title={t.name}
                        />
                      ))}
                    </div>

                    {/* Mode switch */}
                    <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
                      <span className="text-[11px] text-[var(--text-muted)]">Mode</span>
                      <div className="flex items-center gap-1 bg-[var(--bg-card)] p-0.5 rounded-lg border border-[var(--border-subtle)]">
                        <button
                          onClick={() => setMode('light')}
                          className={`p-1 rounded ${mode === 'light' ? 'bg-[var(--bg-surface)] text-[var(--text-main)] shadow-sm' : 'text-[var(--text-muted)]'}`}
                          title="Light"
                        >
                          <Sun className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setMode('dark')}
                          className={`p-1 rounded ${mode === 'dark' ? 'bg-[var(--bg-surface)] text-[var(--text-main)] shadow-sm' : 'text-[var(--text-muted)]'}`}
                          title="Dark"
                        >
                          <Moon className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setMode('system')}
                          className={`p-1 rounded ${mode === 'system' ? 'bg-[var(--bg-surface)] text-[var(--text-main)] shadow-sm' : 'text-[var(--text-muted)]'}`}
                          title="System"
                        >
                          <Monitor className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Avatar & Menu */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-[var(--bg-card)] transition"
                  aria-label="User menu"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.name}
                      className="w-7 h-7 rounded-full border border-[var(--border-subtle)] object-cover"
                    />
                  ) : (
                    <div 
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm"
                      style={{ backgroundColor: 'var(--primary)' }}
                    >
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)] hidden sm:block" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-surface)] p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-[var(--border-subtle)] mb-1">
                      <p className="text-xs font-bold text-[var(--text-main)] truncate">{user.name}</p>
                      <p className="text-[11px] text-[var(--text-muted)] truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[var(--text-main)] hover:bg-[var(--bg-card)] transition"
                    >
                      <User className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      <span>Profile & Badges</span>
                    </Link>

                    <Link
                      to="/appearance"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[var(--text-main)] hover:bg-[var(--bg-card)] transition"
                    >
                      <Palette className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      <span>Appearance & Theme</span>
                    </Link>

                    <Link
                      to="/benchmarks"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[var(--text-main)] hover:bg-[var(--bg-card)] transition"
                    >
                      <Award className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      <span>Peer Benchmarks</span>
                    </Link>

                    <div className="my-1 border-t border-[var(--border-subtle)]" />

                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] transition"
              >
                Sign In
              </Link>
              <Link
                to="/analyze"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white shadow-sm transition hover:opacity-90"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Try Demo Analysis</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
