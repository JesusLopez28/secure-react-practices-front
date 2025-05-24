import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const { login, error, loading, requiresMfa } = useAuth();
  const navigate = useNavigate();

  // Estado para mostrar/ocultar contraseña
  const [showPassword, setShowPassword] = useState(false);

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(credentials.email, credentials.password);
      
      // Si requiere MFA, redirigir a la página de verificación
      if (requiresMfa) {
        navigate('/verify-mfa');
      } else {
        // Si no requiere MFA, redirigir al dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      // El error se maneja en el contexto de auth
      console.error('Error en login:', err);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <div className="bg-gradient rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{width: 60, height: 60, background: "linear-gradient(135deg, #6610f2, #0d6efd)"}}>
                  {/* Nuevo icono: candado moderno */}
                  <svg className="text-white" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <rect x="5" y="11" width="14" height="8" rx="3" stroke="#fff" strokeWidth="2"/>
                    <path d="M8 11V8a4 4 0 018 0v3" stroke="#fff" strokeWidth="2"/>
                    <circle cx="12" cy="15" r="1.5" fill="#8b5cf6"/>
                  </svg>
                </div>
                <h2 className="fw-bold text-primary mb-1">Iniciar sesión</h2>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold">Correo electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-semibold">Contraseña</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      id="password"
                      name="password"
                      value={credentials.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      tabIndex={-1}
                      style={{borderLeft: 0}}
                      onClick={() => setShowPassword(v => !v)}
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showPassword ? (
                        // Ojo abierto
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="#8b5cf6" strokeWidth="2"/>
                          <circle cx="12" cy="12" r="3" stroke="#8b5cf6" strokeWidth="2"/>
                        </svg>
                      ) : (
                        // Ojo cerrado
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M17.94 17.94A10.97 10.97 0 0112 19c-7 0-11-7-11-7a21.77 21.77 0 014.22-5.94M22.54 6.42A21.77 21.77 0 0123 12s-4 7-11 7a10.97 10.97 0 01-5.94-1.94M1 1l22 22" stroke="#8b5cf6" strokeWidth="2"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-100 fw-bold py-2"
                >
                  {loading ? 'Iniciando sesión...' : 'Entrar'}
                </button>
              </form>
              {error && (
                <div className="alert alert-danger mt-3">
                  {error}
                </div>
              )}
              <div className="mt-4 text-center">
                <span className="text-muted">¿No tienes una cuenta? </span>
                <a href="/register" className="fw-semibold text-decoration-none text-primary">Regístrate</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
