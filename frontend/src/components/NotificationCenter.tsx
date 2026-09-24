import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Link } from 'react-router-dom';
import { Bell, X, Flame, MapPin, Sparkles, Info, ExternalLink } from 'lucide-react';

export const NotificationCenter: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markAllNotificationsRead, dismissNotification } = useDashboard();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'streak': return <Flame className="w-4 h-4 text-[#F97316]" />;
      case 'milestone': return <MapPin className="w-4 h-4 text-[#F97316]" />;
      case 'analysis': return <Sparkles className="w-4 h-4 text-[#16A34A]" />;
      default: return <Info className="w-4 h-4 text-[#78716C]" />;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-[#E7E5E4] bg-white shadow-xl z-50 overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#E7E5E4] bg-[#FAFAFA]">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#F97316]" />
          <h4 className="text-xs font-bold text-[#1C1917] uppercase tracking-wider">Notifications</h4>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-[#F97316] text-white text-[10px] font-bold">
              {unreadCount}
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="text-[11px] text-[#F97316] hover:text-[#EA580C] font-semibold transition cursor-pointer"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-[#E7E5E4] p-1">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#78716C]">
            No active notifications. You're all caught up!
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-3.5 rounded-xl transition flex items-start justify-between gap-3 ${
                notif.read ? 'opacity-70 hover:opacity-100 hover:bg-[#FAFAFA]' : 'bg-[#FFF3E8]/40 hover:bg-[#FFF3E8]/70'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-2 rounded-lg bg-white border border-[#E7E5E4] shrink-0 shadow-sm">
                  {getIcon(notif.type)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h5 className="text-xs font-bold text-[#1C1917]">{notif.title}</h5>
                    <span className="text-[10px] text-[#78716C]">{notif.timestamp}</span>
                  </div>
                  <p className="text-xs text-[#78716C] leading-relaxed">{notif.message}</p>
                  {notif.link && (
                    <Link
                      to={notif.link}
                      onClick={onClose}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#F97316] hover:text-[#EA580C] pt-1"
                    >
                      <span>View details</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>

              <button
                onClick={() => dismissNotification(notif.id)}
                className="p-1 rounded text-[#78716C] hover:text-[#1C1917] transition shrink-0 cursor-pointer"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-[#E7E5E4] bg-[#FAFAFA] text-center">
        <span className="text-[11px] text-[#78716C]">Milestone reminders and streak alerts</span>
      </div>
    </div>
  );
};
