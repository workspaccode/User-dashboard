import { MemoryRouter, Routes, Route, Navigate } from 'react-router';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
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

export default function App() {
  return (
    <MemoryRouter initialEntries={['/']}>
      <Toaster />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/dashboard" element={<AppShell><ErrorBoundary><DashboardPage /></ErrorBoundary></AppShell>} />
        <Route path="/project/:id" element={<AppShell><ErrorBoundary><ProjectPage /></ErrorBoundary></AppShell>} />
        <Route path="/project/:id/canvas" element={<AppShell fullWidth><ErrorBoundary><CanvasPage /></ErrorBoundary></AppShell>} />
        <Route path="/project/:id/canvas/3d" element={<AppShell fullWidth><ErrorBoundary><Canvas3DPage /></ErrorBoundary></AppShell>} />
        <Route path="/design-system/new" element={<AppShell><ErrorBoundary><DesignSystemPage /></ErrorBoundary></AppShell>} />
        <Route path="/settings" element={<AppShell><ErrorBoundary><SettingsPage /></ErrorBoundary></AppShell>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MemoryRouter>
  );
}
