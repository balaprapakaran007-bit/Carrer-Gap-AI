import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Compass, Flame, Award, LogOut, User, Menu, X, ArrowRight } from 'lucide-react';

export const Navbar: React.FC<{ toggleSidebar?: () => void; isSidebarOpen?: boolean }> = ({ toggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Brand & Sidebar toggle */}
        <div className="flex items-center gap-3">
          {user && toggleSidebar && (
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
              aria-label="Toggle Navigation"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                CareerGap<span className="text-blue-400"> AI</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Quick Links if logged out */}
        {!user && (
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a href="#how-it-works" className="hover:text-white transition">How It Works</a>
            <a href="#capabilities" className="hover:text-white transition">Capabilities</a>
            <a href="#comparison" className="hover:text-white transition">ATS vs CareerGap</a>
          </nav>
        )}

        {/* Right: Actions / Profile */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Gamification Streak Badge */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                <span>5 Day Streak</span>
              </div>

              {/* Quick Analyze Button */}
              <Link
                to="/analyze"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Analyze Job</span>
              </Link>

              {/* User Avatar & Logout */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.name} className="w-8 h-8 rounded-full border border-slate-700" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 text-xs font-bold">
                    {user.name.charAt(0)}
                  </div>
                )}
                <span className="hidden md:inline text-xs font-medium text-slate-300">{user.name}</span>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-900 transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800/80 transition"
              >
                Sign In
              </Link>
              <Link
                to="/analyze"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition"
              >
                <span>Try Demo Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
