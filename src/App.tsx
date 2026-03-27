import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { OrganizationList } from './pages/Organizations/OrganizationList';
import { CreateOrganization } from './pages/Organizations/CreateOrganization';
import { NicheList } from './pages/Niches/NicheList';
import { NicheForm } from './pages/Niches/NicheForm';
import { Layout } from './components/Layout';

const queryClient = new QueryClient();

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is systemAdmin
  if (user.role !== 'systemAdmin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400">You must be a system administrator to access this portal.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organizations"
                element={
                  <ProtectedRoute>
                    <OrganizationList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organizations/new"
                element={
                  <ProtectedRoute>
                    <CreateOrganization />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/niches"
                element={
                  <ProtectedRoute>
                    <NicheList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/niches/new"
                element={
                  <ProtectedRoute>
                    <NicheForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/niches/:key"
                element={
                  <ProtectedRoute>
                    <NicheForm />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
