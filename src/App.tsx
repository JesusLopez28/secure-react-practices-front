import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css'
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import MfaSetup from './components/MfaSetup';
import MfaVerify from './components/MfaVerify';
import Dashboard from './pages/Dashboard';

// Componente para rutas protegidas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Cargando...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// Componente para rutas que requieren MFA
const MfaRoute = ({ children }: { children: React.ReactNode }) => {
  const { requiresMfa, loading } = useAuth();
  
  if (loading) {
    return <div>Cargando...</div>;
  }
  
  if (!requiresMfa) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/verify-mfa" element={
        <MfaRoute>
          <MfaVerify />
        </MfaRoute>
      } />
      <Route path="/setup-mfa" element={
        <ProtectedRoute>
          <MfaSetup />
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-dark" style={{background: "var(--color-bg)", minHeight: "100vh"}}>
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App
