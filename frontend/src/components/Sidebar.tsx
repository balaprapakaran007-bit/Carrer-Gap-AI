import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  MapPin,
  Mic,
  BarChart3,
  Layers,
  Share2,
  FileText,
  Target,
  Flame,
  Award,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/analyze', label: 'Analyze Job', icon: Sparkles, badge: 'AI' },
    { to: '/roadmaps/demo-analysis-ml-01', label: 'Career Roadmaps', icon: MapPin },
    { to: '/interview/demo-analysis-ml-01', label: 'Interview Simulator', icon: Mic, badge: 'New' },
    { to: '/multi-compare', label: 'Multi-Job Compare', icon: Layers },
    { to: '/benchmarks', label: 'Peer Benchmarks', icon: BarChart3 },
    { to: '/share/demo-share-careergap-2026', label: 'Public Profile', icon: Share2 },
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
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 border-r border-slate-800/80 bg-slate-950/95 p-4 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Main Navigation */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Navigation
            </p>
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Quick Stats / Streak Widget */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Momentum</span>
              <span className="flex items-center gap-1 text-xs font-bold text-amber-400">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                5 Days
              </span>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Docker Ready</span>
                <span className="text-slate-200 font-semibold">1 step left</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: '65%' }} />
              </div>
            </div>

            <div className="pt-1 flex items-center gap-2 text-[11px] text-slate-400">
              <Award className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="truncate">Next: 'Docker Ready' badge</span>
            </div>
          </div>
        </div>

        {/* Footer tagline */}
        <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 text-center">
          "Don't just know your match. Know your next move."
        </div>
      </aside>
    </>
  );
};
