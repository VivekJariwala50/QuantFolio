import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { Dashboard } from './pages/Dashboard';
import { Auth } from './pages/Auth';
import { Simulator } from './pages/Simulator';
import { Analytics } from './pages/Analytics';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { ThemeProvider } from './contexts/ThemeContext';

function AppContent() {
  const { initialize, user } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-main)', color: 'var(--text-primary)' }}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: 500,
          },
          success: {
            iconTheme: { primary: '#22C55E', secondary: 'white' },
          },
          error: {
            iconTheme: { primary: '#EF4444', secondary: 'white' },
          },
        }}
      />

      {user ? (
        <div className="flex min-h-screen">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="flex-1 flex flex-col min-h-screen lg:ml-64 transition-all duration-300">
            <TopBar onMenuClick={() => setSidebarOpen(true)} />
            <main className="flex-1 overflow-x-hidden animate-fade-in">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/simulator" element={<Simulator />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;