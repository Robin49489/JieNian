import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SiteHeader } from './components/layout/SiteHeader';
import { SiteFooter } from './components/layout/SiteFooter';
import { Home } from './components/Home';
import { Observatory } from './components/Observatory';
import Arena from './components/Arena';
import { BountyMarket } from './components/BountyMarket';
import { ClaimGuide } from './components/ClaimGuide';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { LoginModal } from './components/ui/LoginModal';
import { useAuth } from './lib/useAuth';

function AppContent() {
  const { user, isLoginModalOpen, authError, openLogin, closeLogin, logout, getToken } = useAuth();

  return (
    <div className="page-shell min-h-screen font-[var(--font-body)] text-[var(--ink)]">
      <SiteHeader user={user} onLoginClick={openLogin} onLogout={logout} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/observatory" element={<Observatory user={user} />} />
          <Route path="/observatory/:roomId" element={<Observatory user={user} />} />
          <Route path="/arena" element={<Arena />} />
          <Route path="/bounty" element={<BountyMarket />} />
          <Route path="/guide" element={<ClaimGuide user={user} onLoginClick={openLogin} getToken={getToken} />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
        </Routes>
      </main>
      <SiteFooter />

      {/* Login Consent Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLogin} />

      {/* Auth Error Toast */}
      {authError && (
        <div className="fixed bottom-6 left-1/2 z-[9999] -translate-x-1/2 rounded-2xl border border-red-200 bg-red-50 px-6 py-3 text-sm font-bold text-red-700 shadow-xl">
          {authError}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
