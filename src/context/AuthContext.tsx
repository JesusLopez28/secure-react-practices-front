import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types/User';
import { authApi } from '../api/auth';

// Definir AuthState localmente
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  requiresMfa: boolean;
  tempToken: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => void;
  setupMfa: () => Promise<{ secret: string; qrCode: string }>;
  verifyMfa: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
    requiresMfa: false,
    tempToken: null
  });

  // Verificar si hay un token almacenado al cargar
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setState({
        ...state,
        user: JSON.parse(user),
        isAuthenticated: true,
        loading: false
      });
    } else {
      setState({
        ...state,
        loading: false
      });
    }
  }, []);

  // Iniciar sesión
  const login = async (email: string, password: string) => {
    try {
      setState({ ...state, loading: true, error: null });
      
      const response = await authApi.login({ email, password });
      
      if (response.requiresMfa) {
        // Si requiere MFA, guardar token temporal y cambiar estado
        localStorage.setItem('tempToken', response.tempToken);
        setState({
          ...state,
          loading: false,
          requiresMfa: true,
          tempToken: response.tempToken
        });
        return;
      }
      
      // Login exitoso sin MFA
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setState({
        ...state,
        user: response.user,
        isAuthenticated: true,
        loading: false
      });
    } catch (error: any) {
      setState({
        ...state,
        error: error.response?.data?.message || 'Error al iniciar sesión',
        loading: false
      });
    }
  };

  // Registrar usuario
  const register = async (username: string, email: string, password: string, confirmPassword: string) => {
    try {
      setState({ ...state, loading: true, error: null });
      
      await authApi.register({ username, email, password, confirmPassword });
      
      setState({
        ...state,
        loading: false
      });
    } catch (error: any) {
      setState({
        ...state,
        error: error.response?.data?.message || 'Error al registrar usuario',
        loading: false
      });
    }
  };

  // Cerrar sesión
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tempToken');
    
    setState({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      requiresMfa: false,
      tempToken: null
    });
  };

  // Configurar MFA
  const setupMfa = async () => {
    try {
      setState({ ...state, loading: true, error: null });
      
      const response = await authApi.setupMfa();
      
      setState({
        ...state,
        loading: false
      });
      
      return {
        secret: response.secret,
        qrCode: response.qrCode
      };
    } catch (error: any) {
      setState({
        ...state,
        error: error.response?.data?.message || 'Error al configurar MFA',
        loading: false
      });
      throw error;
    }
  };

  // Verificar código MFA
  const verifyMfa = async (token: string) => {
    try {
      setState({ ...state, loading: true, error: null });
      
      // Verificar que tengamos el token temporal y un userId válido
      if (!state.tempToken || !state.user?.id) {
        throw new Error('Información de autenticación incompleta');
      }
      
      const response = await authApi.verifyMfa({
        token,
        userId: state.user.id
      });
      
      // Verificación exitosa, guardar token completo
      localStorage.setItem('token', response.token);
      localStorage.removeItem('tempToken');
      
      setState({
        ...state,
        isAuthenticated: true,
        requiresMfa: false,
        tempToken: null,
        loading: false
      });
    } catch (error: any) {
      setState({
        ...state,
        error: error.response?.data?.message || 'Código MFA inválido',
        loading: false
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        setupMfa,
        verifyMfa
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
