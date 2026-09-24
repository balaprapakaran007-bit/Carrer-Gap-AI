import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Link } from 'react-router-dom';
import { Bell, Check, X, Flame, MapPin, Sparkles, Info, ExternalLink } from 'lucide-react';

export const NotificationCenter: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markAllNotificationsRead, dismissNotification } = useDashboard();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'streak': return <Flame className="w-4 h-4 text-amber-400" />;
      case 'milestone': return <MapPin className="w-4 h-4 text-blue-400" />;
      case 'analysis': return <Sparkles className="w-4 h-4 text-emerald-400" />;
      default: return <Info className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-800 bg-slate-950/95 backdrop-blur-xl shadow-2xl z-50 overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Notifications</h4>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[10px] font-bold">
              {unreadCount}
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold transition"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-850 p-1">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No active notifications. You're all caught up!
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-3.5 rounded-xl transition flex items-start justify-between gap-3 ${
                notif.isRead ? 'opacity-70 hover:opacity-100 hover:bg-slate-900/40' : 'bg-slate-900/50 hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                  {getIcon(notif.type)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h5 className="text-xs font-bold text-slate-100">{notif.title}</h5>
                    <span className="text-[10px] text-slate-500">{notif.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{notif.message}</p>
                  {notif.link && (
                    <Link
                      to={notif.link}
                      onClick={onClose}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300 pt-1"
                    >
                      <span>View details</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>

              <button
                onClick={() => dismissNotification(notif.id)}
                className="p-1 rounded text-slate-500 hover:text-slate-300 transition shrink-0"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950 text-center">
        <span className="text-[11px] text-slate-500">Milestone reminders and streak alerts</span>
      </div>
    </div>
  );
};
