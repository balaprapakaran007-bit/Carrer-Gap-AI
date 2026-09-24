import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';

export interface NotificationItem {
  id: string;
  type: 'milestone' | 'streak' | 'analysis' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  isRead: boolean;
  link?: string;
}

export interface FirstRunChecklist {
  uploadResume: boolean;
  analyzeJob: boolean;
  reviewGaps: boolean;
  generateRoadmap: boolean;
  isDismissed: boolean;
}

export interface DashboardWidgetConfig {
  id: 'momentum' | 'skills' | 'progress' | 'insight' | 'activity';
  label: string;
  visible: boolean;
}

interface TargetRoleItem {
  id: string;
  title: string;
  company: string;
}

interface DashboardContextType {
  activeRoleId: string;
  setActiveRoleId: (id: string) => void;
  availableRoles: TargetRoleItem[];
  isDemoMode: boolean;
  pinnedIds: string[];
  togglePin: (id: string) => void;
  removePin: (id: string) => void;
  notifications: NotificationItem[];
  unreadCount: number;
  markAllNotificationsRead: () => void;
  dismissNotification: (id: string) => void;
  checklist: FirstRunChecklist;
  isChecklistDismissed: boolean;
  updateChecklist: (key: keyof FirstRunChecklist, val: boolean) => void;
  dismissChecklist: () => void;
  hasSeenTour: boolean;
  setHasSeenTour: (val: boolean) => void;
  dashboardLayout: DashboardWidgetConfig[];
  toggleWidgetVisibility: (id: DashboardWidgetConfig['id']) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [availableRoles] = useState<TargetRoleItem[]>([
    { id: 'demo-analysis-ml-01', title: 'Machine Learning Engineer', company: 'AI Nexus Corp' },
    { id: 'demo-analysis-fs-02', title: 'Full Stack AI Engineer', company: 'ScaleFlow' },
    { id: 'demo-analysis-ds-03', title: 'Lead Data Scientist', company: 'DeepMetrics' }
  ]);

  const [activeRoleId, setActiveRoleId] = useState<string>('demo-analysis-ml-01');
  const isDemoMode = true;

  const [pinnedIds, setPinnedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cg_pinned_ids');
      return saved ? JSON.parse(saved) : ['demo-analysis-ml-01'];
    } catch {
      return ['demo-analysis-ml-01'];
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      type: 'milestone',
      title: 'Roadmap Milestone Due',
      message: 'Docker Fundamentals task is scheduled for this week.',
      timestamp: '10m ago',
      read: false,
      isRead: false,
      link: '/roadmaps/demo-analysis-ml-01'
    },
    {
      id: 'notif-2',
      type: 'streak',
      title: 'Streak Protected 🔥',
      message: 'You have logged 5 consecutive days of career progress!',
      timestamp: '2h ago',
      read: false,
      isRead: false,
      link: '/dashboard'
    },
    {
      id: 'notif-3',
      type: 'analysis',
      title: 'AI Analysis Ready',
      message: 'Machine Learning Engineer compatibility report is complete.',
      timestamp: '1d ago',
      read: true,
      isRead: true,
      link: '/analysis/demo-analysis-ml-01'
    }
  ]);

  const [checklist, setChecklist] = useState<FirstRunChecklist>(() => {
    try {
      const saved = localStorage.getItem('cg_first_run_checklist');
      return saved ? JSON.parse(saved) : {
        uploadResume: true,
        analyzeJob: true,
        reviewGaps: true,
        generateRoadmap: true,
        isDismissed: false
      };
    } catch {
      return {
        uploadResume: true,
        analyzeJob: true,
        reviewGaps: true,
        generateRoadmap: true,
        isDismissed: false
      };
    }
  });

  const [hasSeenTour, setHasSeenTourState] = useState<boolean>(() => {
    return localStorage.getItem('cg_has_seen_tour') === 'true';
  });

  const [dashboardLayout, setDashboardLayout] = useState<DashboardWidgetConfig[]>([
    { id: 'momentum', label: 'Career Momentum', visible: true },
    { id: 'skills', label: 'Skill Gap Visualizer', visible: true },
    { id: 'progress', label: 'Career Progress Chart', visible: true },
    { id: 'insight', label: 'AI Career Insight', visible: true },
    { id: 'activity', label: 'Recent Activity', visible: true },
  ]);

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Global Keyboard listener for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const togglePin = (id: string) => {
    const updated = pinnedIds.includes(id) ? pinnedIds.filter(x => x !== id) : [...pinnedIds, id];
    setPinnedIds(updated);
    localStorage.setItem('cg_pinned_ids', JSON.stringify(updated));
  };

  const removePin = (id: string) => {
    const updated = pinnedIds.filter(x => x !== id);
    setPinnedIds(updated);
    localStorage.setItem('cg_pinned_ids', JSON.stringify(updated));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true, isRead: true })));
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const updateChecklist = (key: keyof FirstRunChecklist, val: boolean) => {
    const updated = { ...checklist, [key]: val };
    setChecklist(updated);
    localStorage.setItem('cg_first_run_checklist', JSON.stringify(updated));
  };

  const dismissChecklist = () => {
    const updated = { ...checklist, isDismissed: true };
    setChecklist(updated);
    localStorage.setItem('cg_first_run_checklist', JSON.stringify(updated));
  };

  const setHasSeenTour = (val: boolean) => {
    setHasSeenTourState(val);
    localStorage.setItem('cg_has_seen_tour', String(val));
  };

  const toggleWidgetVisibility = (id: DashboardWidgetConfig['id']) => {
    setDashboardLayout(prev =>
      prev.map(w => (w.id === id ? { ...w, visible: !w.visible } : w))
    );
  };

  const unreadCount = notifications.filter(n => !n.read && !n.isRead).length;

  return (
    <DashboardContext.Provider value={{
      activeRoleId, setActiveRoleId, availableRoles, isDemoMode,
      pinnedIds, togglePin, removePin,
      notifications, unreadCount, markAllNotificationsRead, dismissNotification,
      checklist, isChecklistDismissed: checklist.isDismissed, updateChecklist, dismissChecklist,
      hasSeenTour, setHasSeenTour,
      dashboardLayout, toggleWidgetVisibility,
      isCommandPaletteOpen, setIsCommandPaletteOpen
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within a DashboardProvider');
  return ctx;
};
