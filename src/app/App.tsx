import { MemoryRouter, Routes, Route, Navigate, useLocation } from 'react-router';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { VerifyEmailPage } from './components/VerifyEmailPage';
import { OnboardingPage } from './components/OnboardingPage';
import { AppShell } from './components/AppShell';
import { DashboardPage } from './components/DashboardPage';
import { ProjectPage } from './components/ProjectPage';
import { CanvasPage } from './components/CanvasPage';
import { Canvas3DPage } from './components/Canvas3DPage';
import { DesignSystemPage } from './components/DesignSystemPage';
import { SettingsPage } from './components/SettingsPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from './components/ui/sonner';
import { AuthProvider, useAuth } from './lib/AuthContext';
import type { ReactNode } from 'react';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0f',
      }}>
        <div style={{
          width: 24,
          height: 24,
          border: '2px solid rgba(255,255,255,0.1)',
          borderTopColor: '#7C6AF7',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <MemoryRouter initialEntries={['/']}>
      <Toaster />
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/signup" element={<AuthPage mode="signup" />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><AppShell><ErrorBoundary><DashboardPage /></ErrorBoundary></AppShell></ProtectedRoute>} />
          <Route path="/project/:id" element={<ProtectedRoute><AppShell><ErrorBoundary><ProjectPage /></ErrorBoundary></AppShell></ProtectedRoute>} />
          <Route path="/project/:id/canvas" element={<ProtectedRoute><AppShell fullWidth><ErrorBoundary><CanvasPage /></ErrorBoundary></AppShell></ProtectedRoute>} />
          <Route path="/project/:id/canvas/3d" element={<ProtectedRoute><AppShell fullWidth><ErrorBoundary><Canvas3DPage /></ErrorBoundary></AppShell></ProtectedRoute>} />
          <Route path="/design-system/new" element={<ProtectedRoute><AppShell><ErrorBoundary><DesignSystemPage /></ErrorBoundary></AppShell></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><AppShell><ErrorBoundary><SettingsPage /></ErrorBoundary></AppShell></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}
