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
  tempEmail: string | null;
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
    tempToken: null,
    tempEmail: null
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
      const res = response as { requiresMfa?: boolean; tempToken?: string; token?: string; user?: User; tempEmail?: string };

      // SIEMPRE requiere MFA tras login exitoso
      if (res.requiresMfa) {
        localStorage.setItem('tempEmail', email);
        setState({
          ...state,
          loading: false,
          requiresMfa: true,
          tempEmail: email
        });
        return;
      }
      // Nunca debe llegar aquí, pero por compatibilidad:
      setState({
        ...state,
        error: 'Error inesperado en el flujo de autenticación',
        loading: false
      });
    } catch (error: any) {
      let msg = 'Error al iniciar sesión';
      if ((error as any).response?.data?.message) {
        msg = (error as any).response.data.message;
      } else if ((error as any).message) {
        msg = (error as any).message;
      }
      setState({
        ...state,
        error: msg,
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
      let msg = 'Error al registrar usuario';
      if ((error as any).response?.data?.message) {
        msg = (error as any).response.data.message;
      } else if ((error as any).message) {
        msg = (error as any).message;
      }
      setState({
        ...state,
        error: msg,
        loading: false
      });
    }
  };

  // Cerrar sesión
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tempToken');
    localStorage.removeItem('tempEmail');
    
    setState({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      requiresMfa: false,
      tempToken: null,
      tempEmail: null
    });
  };

  // Configurar MFA
  const setupMfa = async () => {
    try {
      setState({ ...state, loading: true, error: null });
      
      const response = await authApi.setupMfa();
      const res = response as { secret: string; qrCode: string };
      
      setState({
        ...state,
        loading: false
      });
      
      return {
        secret: res.secret,
        qrCode: res.qrCode
      };
    } catch (error: any) {
      let msg = 'Error al configurar MFA';
      if ((error as any).response?.data?.message) {
        msg = (error as any).response.data.message;
      } else if ((error as any).message) {
        msg = (error as any).message;
      }
      setState({
        ...state,
        error: msg,
        loading: false
      });
      throw error;
    }
  };

  // Verificar código MFA
  const verifyMfa = async (code: string) => {
    try {
      setState({ ...state, loading: true, error: null });

      if (!state.tempEmail) {
        throw new Error('Información de autenticación incompleta');
      }

      // Enviar el email temporal guardado tras login
      const response = await authApi.verifyMfa({
        code,
        email: state.tempEmail
      });

      // Asegurarse de que response tiene la forma esperada
      const res = response as { token: string; user: User };

      // Verificación exitosa, guardar token completo
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      localStorage.removeItem('tempEmail');

      setState({
        ...state,
        user: res.user,
        isAuthenticated: true,
        requiresMfa: false,
        tempEmail: null,
        loading: false
      });
    } catch (error: any) {
      let msg = 'Código MFA inválido';
      if ((error as any).response && (error as any).response.data && (error as any).response.data.message) {
        msg = (error as any).response.data.message;
      } else if ((error as any).message) {
        msg = (error as any).message;
      }
      setState({
        ...state,
        error: msg,
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
