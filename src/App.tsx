/**
 * App Component
 *
 * Main application with routing, context providers, and layout.
 * Validates: Requirements 15.1, 16.4, 17.1
 */

import { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@context/ThemeContext';
import { UserProvider } from '@context/UserContext';
import { AuthProvider } from '@context/AuthContext';
import { Navbar } from '@components/common/Navbar';
import { Footer } from '@components/common/Footer';
import { LoadingScreen } from '@components/common/LoadingScreen';
import { ErrorBoundary } from '@components/common/ErrorBoundary';
import { ProtectedRoute } from '@components/common/ProtectedRoute';
import { InstallPrompt } from '@components/common/InstallPrompt';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('@pages/HomePage'));
const DetailsPage = lazy(() => import('@pages/DetailsPage'));
const SearchPage = lazy(() => import('@pages/SearchPage'));
const RecommendationsPage = lazy(() => import('@pages/RecommendationsPage'));
const DashboardPage = lazy(() => import('@pages/DashboardPage'));
const AboutPage = lazy(() => import('@pages/AboutPage'));
const PrivacyPage = lazy(() => import('@pages/PrivacyPage'));
const TermsPage = lazy(() => import('@pages/TermsPage'));
const ContactPage = lazy(() => import('@pages/ContactPage'));
const LoginPage = lazy(() => import('@pages/LoginPage'));
const SignupPage = lazy(() => import('@pages/SignupPage'));
const ChatbotPage = lazy(() => import('@pages/ChatbotPage'));
const MoodPage = lazy(() => import('@pages/MoodPage'));
const QuizPage = lazy(() => import('@pages/QuizPage'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-accent-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// Layout wrapper that conditionally shows navbar/footer
function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      {!isAuthPage && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}

function App() {
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <UserProvider>
          <BrowserRouter>
            <ErrorBoundary>
              <LoadingScreen isLoading={initialLoading} />
              <InstallPrompt />
              <AppLayout>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    
                    {/* Protected routes */}
                    <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                    <Route path="/movie/:id" element={<ProtectedRoute><DetailsPage /></ProtectedRoute>} />
                    <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
                    <Route path="/recommendations" element={<ProtectedRoute><RecommendationsPage /></ProtectedRoute>} />
                    <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                    <Route path="/about" element={<ProtectedRoute><AboutPage /></ProtectedRoute>} />
                    <Route path="/privacy" element={<ProtectedRoute><PrivacyPage /></ProtectedRoute>} />
                    <Route path="/terms" element={<ProtectedRoute><TermsPage /></ProtectedRoute>} />
                    <Route path="/contact" element={<ProtectedRoute><ContactPage /></ProtectedRoute>} />
                    <Route path="/chatbot" element={<ProtectedRoute><ChatbotPage /></ProtectedRoute>} />
                    <Route path="/mood" element={<ProtectedRoute><MoodPage /></ProtectedRoute>} />
                    <Route path="/quiz" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
                  </Routes>
                </Suspense>
              </AppLayout>
            </ErrorBoundary>
          </BrowserRouter>
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
