import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  const { pinnedIds } = useDashboard();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const sections = [
    {
      title: 'WORKSPACE',
      items: [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
        { to: '/analyze', label: 'Analyze Job', icon: Sparkles, badge: 'AI', exact: true },
        { to: '/analyze?tab=resume', label: 'My Resumes', icon: FileText, exact: false },
        { to: '/analysis/demo-analysis-ml-01', label: 'My Analyses', icon: FileText, exact: false },
      ],
    },
    {
      title: 'CAREER',
      items: [
        { to: '/roadmaps/demo-analysis-ml-01', label: 'Career Roadmaps', icon: MapPin, exact: false },
        { to: '/benchmarks', label: 'Skill Progress', icon: TrendingUp, exact: true },
        { to: '/dashboard#projects', label: 'Projects', icon: FolderGit2, exact: false },
        { to: '/interview/demo-analysis-ml-01', label: 'Interview Simulator', icon: Mic, badge: 'New', exact: false },
      ],
    },
    {
      title: 'INSIGHTS',
      items: [
        { to: '/multi-compare', label: 'Multi-Job Compare', icon: Layers, exact: true },
        { to: '/benchmarks', label: 'Career Trends', icon: BarChart3, exact: false },
        { to: '/benchmarks?tab=peers', label: 'Peer Benchmarks', icon: Sliders, exact: false },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { to: '/profile', label: 'Profile', icon: User, exact: true },
        { to: '/appearance', label: 'Appearance', icon: Palette, exact: true },
        { to: '/appearance?tab=advanced', label: 'Settings', icon: Settings, exact: false },
      ],
    },
  ];

  const isItemActive = (to: string, exact?: boolean) => {
    const currentPath = location.pathname + location.search + location.hash;
    if (to.includes('?') || to.includes('#')) {
      return currentPath === to;
    }
    if (exact) {
      return location.pathname === to;
    }
    return location.pathname.startsWith(to.split('?')[0].split('#')[0]);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-14 bottom-0 left-0 z-40 ${
          isCollapsed ? 'w-16' : 'w-64'
        } border-r border-[#E7E5E4] bg-white p-3 flex flex-col justify-between transition-all duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-4 overflow-y-auto pr-1">
          {/* Collapse Toggle for Desktop */}
          <div className="hidden lg:flex justify-end pb-1">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAFAFA] transition cursor-pointer"
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
                <div className="flex items-center gap-1 px-2.5 text-[10px] font-bold uppercase tracking-wider text-[#78716C]">
                  <Pin className="w-3 h-3 text-[#F97316]" />
                  <span>PINNED</span>
                </div>
              )}
              {pinnedIds.map((pinId) => (
                <NavLink
                  key={pinId}
                  to={`/analysis/${pinId}`}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-[#FFF3E8] text-[#F97316] border border-[#F97316]/30'
                        : 'text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAFAFA]'
                    }`
                  }
                  title={pinId}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Sparkles className="w-3.5 h-3.5 shrink-0 text-[#F97316]" />
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
                <p className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-[#78716C]">
                  {section.title}
                </p>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isItemActive(item.to, item.exact);

                return (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    onClick={onClose}
                    className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition ${
                      active
                        ? 'bg-[#FFF3E8] text-[#F97316] font-bold border border-[#F97316]/30'
                        : 'text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAFAFA]'
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-[#F97316]' : 'text-[#78716C]'}`} />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </div>
                    {!isCollapsed && item.badge && (
                      <span 
                        className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#FFF3E8] text-[#F97316] border border-[#F97316]/30"
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
          <div className="pt-3 border-t border-[#E7E5E4]">
            <div className="rounded-xl border border-[#E7E5E4] bg-[#F5F5F4] p-3 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#1C1917] flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-[#F97316] fill-[#F97316]" />
                  <span>5 Day Streak</span>
                </span>
                <span className="text-[11px] font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full border border-[#16A34A]/20">
                  +120 XP
                </span>
              </div>
              <p className="text-[11px] text-[#78716C]">
                Next: Docker Ready Badge
              </p>
            </div>
          </div>
        ) : (
          <div className="pt-2 border-t border-[#E7E5E4] flex justify-center">
            <Flame className="w-5 h-5 text-[#F97316] fill-[#F97316]" />
          </div>
        )}
      </aside>
    </>
  );
};
