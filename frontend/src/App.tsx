import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { DashboardProvider } from './context/DashboardContext';

import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { CommandPalette } from './components/CommandPalette';
import { OnboardingTour } from './components/OnboardingTour';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { AnalyzePage } from './pages/AnalyzePage';
import { AnalysisResultPage } from './pages/AnalysisResultPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { InterviewPage } from './pages/InterviewPage';
import { MultiComparePage } from './pages/MultiComparePage';
import { BenchmarksPage } from './pages/BenchmarksPage';
import { SharedProfilePage } from './pages/SharedProfilePage';
import { AppearancePage } from './pages/AppearancePage';
import { ProfilePage } from './pages/ProfilePage';

import './theme.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Hide sidebar and standard navbar on public share and landing/login pages if logged out
  const isPublicShare = location.pathname.startsWith('/share/');
  const isLanding = location.pathname === '/' || location.pathname === '/login';

  if (isPublicShare) {
    return <main className="min-h-screen bg-[var(--bg-app)] text-[var(--text-main)]">{children}</main>;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-main)] flex flex-col selection:bg-[var(--primary)] selection:text-white transition-colors">
      <Navbar
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />
      <div className="flex-1 flex">
        {user && !isLanding && (
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}
        <main className={`flex-1 transition-all duration-200 ${user && !isLanding ? 'lg:pl-64' : ''}`}>
          {children}
        </main>
      </div>
      <CommandPalette />
      <OnboardingTour />
    </div>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <DashboardProvider>
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/analyze" element={<AnalyzePage />} />
                  <Route path="/analysis/:id" element={<AnalysisResultPage />} />
                  <Route path="/roadmaps/:id" element={<RoadmapPage />} />
                  <Route path="/interview/:id" element={<InterviewPage />} />
                  <Route path="/multi-compare" element={<MultiComparePage />} />
                  <Route path="/benchmarks" element={<BenchmarksPage />} />
                  <Route path="/appearance" element={<AppearancePage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/share/:token" element={<SharedProfilePage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </DashboardProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
