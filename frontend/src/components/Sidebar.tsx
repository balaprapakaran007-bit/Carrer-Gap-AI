import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  MapPin,
  Mic,
  BarChart3,
  Layers,
  FileText,
  Pin,
  Palette,
  User,
  Settings,
  Flame,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  FolderGit2,
  Sliders
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { pinnedIds, removePin } = useDashboard();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sections = [
    {
      title: 'WORKSPACE',
      items: [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/analyze', label: 'Analyze Job', icon: Sparkles, badge: 'AI' },
        { to: '/analyze?tab=resume', label: 'My Resumes', icon: FileText },
        { to: '/multi-compare', label: 'My Analyses', icon: Layers },
      ],
    },
    {
      title: 'CAREER',
      items: [
        { to: '/roadmaps/demo-analysis-ml-01', label: 'Career Roadmaps', icon: MapPin },
        { to: '/benchmarks', label: 'Skill Progress', icon: TrendingUp },
        { to: '/dashboard#projects', label: 'Projects', icon: FolderGit2 },
        { to: '/interview/demo-analysis-ml-01', label: 'Interview Simulator', icon: Mic, badge: 'New' },
      ],
    },
    {
      title: 'INSIGHTS',
      items: [
        { to: '/multi-compare', label: 'Multi-Job Compare', icon: Layers },
        { to: '/benchmarks', label: 'Career Trends', icon: BarChart3 },
        { to: '/benchmarks?tab=peers', label: 'Peer Benchmarks', icon: Sliders },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { to: '/profile', label: 'Profile', icon: User },
        { to: '/appearance', label: 'Appearance', icon: Palette },
        { to: '/appearance?tab=advanced', label: 'Settings', icon: Settings },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-14 bottom-0 left-0 z-40 ${
          isCollapsed ? 'w-16' : 'w-64'
        } border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3 flex flex-col justify-between transition-all duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-4 overflow-y-auto pr-1">
          {/* Collapse Toggle for Desktop */}
          <div className="hidden lg:flex justify-end pb-1">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] transition"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Pinned Items Section */}
          {pinnedIds.length > 0 && (
            <div className="space-y-1">
              {!isCollapsed && (
                <div className="flex items-center gap-1 px-2.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  <Pin className="w-3 h-3 text-[var(--primary)]" />
                  <span>PINNED</span>
                </div>
              )}
              {pinnedIds.map((pinId) => (
                <NavLink
                  key={pinId}
                  to={`/analysis/${pinId}`}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition ${
                      isActive
                        ? 'border shadow-sm text-white'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)]'
                    }`
                  }
                  style={({ isActive }) =>
                    isActive
                      ? {
                          backgroundColor: 'var(--primary-muted)',
                          color: 'var(--primary)',
                          borderColor: 'var(--primary)',
                          boxShadow: '0 0 12px var(--primary-muted)',
                        }
                      : {}
                  }
                  title={pinId}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Sparkles className="w-3.5 h-3.5 shrink-0 text-[var(--primary)]" />
                    {!isCollapsed && <span className="truncate text-xs font-medium">ML Engineer (Nexus)</span>}
                  </div>
                </NavLink>
              ))}
            </div>
          )}

          {/* Navigation Sections */}
          {sections.map((section) => (
            <div key={section.title} className="space-y-1">
              {!isCollapsed && (
                <p className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  {section.title}
                </p>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition ${
                        isActive
                          ? 'border shadow-sm'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)]'
                      }`
                    }
                    style={({ isActive }) =>
                      isActive
                        ? {
                            backgroundColor: 'var(--primary-muted)',
                            color: 'var(--primary)',
                            borderColor: 'var(--primary)',
                            boxShadow: '0 0 14px var(--primary-muted)',
                          }
                        : {}
                    }
                    title={isCollapsed ? item.label : undefined}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </div>
                    {!isCollapsed && item.badge && (
                      <span 
                        className="px-1.5 py-0.2 rounded text-[10px] font-bold border"
                        style={{
                          backgroundColor: 'var(--primary-muted)',
                          color: 'var(--primary)',
                          borderColor: 'var(--primary)',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer / Momentum Badge */}
        {!isCollapsed ? (
          <div className="pt-3 border-t border-[var(--border-subtle)]">
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-2.5 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[var(--text-main)] flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  5 Day Streak
                </span>
                <span className="text-[11px] font-bold text-emerald-400">+120 XP</span>
              </div>
              <p className="text-[10px] text-[var(--text-muted)]">
                Next: Docker Ready Badge
              </p>
            </div>
          </div>
        ) : (
          <div className="pt-2 border-t border-[var(--border-subtle)] flex justify-center">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
        )}
      </aside>
    </>
  );
};
