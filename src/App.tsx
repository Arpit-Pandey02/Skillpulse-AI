import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AuthModal } from './components/auth/AuthModal';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { SkillsPage } from './pages/SkillsPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { CareerDiscoveryPage } from './pages/CareerDiscoveryPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public SaaS Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Protected-Style Student App Routes */}
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/discovery" element={<CareerDiscoveryPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />

          {/* 404 Fallback */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
        <AuthModal />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
