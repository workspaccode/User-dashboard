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

export default function App() {
  return (
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/dashboard" element={<AppShell><DashboardPage /></AppShell>} />
        <Route path="/project/:id" element={<AppShell><ProjectPage /></AppShell>} />
        <Route path="/project/:id/canvas" element={<AppShell fullWidth><CanvasPage /></AppShell>} />
        <Route path="/project/:id/canvas/3d" element={<AppShell fullWidth><Canvas3DPage /></AppShell>} />
        <Route path="/design-system/new" element={<AppShell><DesignSystemPage /></AppShell>} />
        <Route path="/settings" element={<AppShell><SettingsPage /></AppShell>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MemoryRouter>
  );
}
