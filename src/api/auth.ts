import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Configurar instancia de Axios con interceptores
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Añadir token a las solicitudes autenticadas
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API de autenticación
export const authApi = {
  // Registrar nuevo usuario
  register: async (userData: { username: string; email: string; password: string; confirmPassword: string }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  // Iniciar sesión
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  // Configurar MFA
  setupMfa: async () => {
    const response = await api.post('/auth/setup-mfa');
    return response.data;
  },
  
  // Verificar código MFA
  verifyMfa: async (params: { token: string; userId: number }) => {
    // Para verificación MFA usamos el token temporal
    const tempToken = localStorage.getItem('tempToken');
    
    const response = await axios.post(`${API_URL}/auth/verify-mfa`, params, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tempToken}`
      }
    });
    
    return response.data;
  }
};
