import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import PasswordStrengthMeter from './PasswordStrengthMeter';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { register, error, loading } = useAuth();
  const navigate = useNavigate();

  // Estado para mostrar/ocultar contraseñas
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validar nombre de usuario
    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    }
    
    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    // Validar contraseña según ISO/IEC 27002 - A.9.2.4
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else {
      if (formData.password.length < 10) {
        newErrors.password = 'La contraseña debe tener al menos 10 caracteres';
      }
      if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = 'La contraseña debe incluir al menos una letra mayúscula';
      }
      if (!/[a-z]/.test(formData.password)) {
        newErrors.password = 'La contraseña debe incluir al menos una letra minúscula';
      }
      if (!/\d/.test(formData.password)) {
        newErrors.password = 'La contraseña debe incluir al menos un número';
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
        newErrors.password = 'La contraseña debe incluir al menos un carácter especial';
      }
    }
    
    // Validar confirmación de contraseña
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await register(
          formData.username,
          formData.email,
          formData.password,
          formData.confirmPassword
        );
        
        // Registro exitoso, redirigir a login
        navigate('/login');
      } catch (err) {
        // El error se maneja en el contexto de auth
        console.error('Error en registro:', err);
      }
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-md-7 col-lg-6">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <div className="bg-gradient rounded-circle d-inline-flex align-items-center justify-content-center mb-2 shadow" style={{width: 64, height: 64}}>
                  {/* Nuevo icono: usuario seguro */}
                  <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="12" cy="8" r="4" stroke="#fff" strokeWidth="2"/>
                    <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke="#fff" strokeWidth="2"/>
                    <path d="M17 7l2 2 3-3" stroke="#22c55e" strokeWidth="2"/>
                  </svg>
                </div>
                <h2 className="fw-bold text-primary mb-1">Crear Cuenta</h2>
                <p className="text-muted mb-0">Únete a la comunidad de seguridad</p>
              </div>
              {error && (
                <div className="alert alert-danger">{error}</div>
              )}
              <form onSubmit={handleSubmit} className="mt-3">
                {/* Nombre de usuario */}
                <div className="mb-3">
                  <label htmlFor="username" className="form-label fw-semibold">Nombre de usuario</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                  />
                  {errors.username && (
                    <div className="invalid-feedback">{errors.username}</div>
                  )}
                </div>
                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>
                {/* Contraseña */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-semibold">Contraseña</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
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
                  <PasswordStrengthMeter password={formData.password} />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                  {/* Requisitos de contraseña, mejor visibilidad */}
                  <ul className="form-text small mt-2 ps-4" style={{color: "#8b5cf6", fontWeight: 500, textAlign: "left"}}>
                    <li>Al menos 10 caracteres</li>
                    <li>Al menos una letra mayúscula</li>
                    <li>Al menos una letra minúscula</li>
                    <li>Al menos un número</li>
                    <li>Al menos un carácter especial</li>
                  </ul>
                </div>
                {/* Confirmar contraseña */}
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label fw-semibold">Confirmar contraseña</label>
                  <div className="input-group">
                    <input
                      type={showConfirm ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      tabIndex={-1}
                      style={{borderLeft: 0}}
                      onClick={() => setShowConfirm(v => !v)}
                      aria-label={showConfirm ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showConfirm ? (
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
                  {errors.confirmPassword && (
                    <div className="invalid-feedback">{errors.confirmPassword}</div>
                  )}
                  {/* Mejor visibilidad para el texto de confirmación */}
                  <div className="form-text small mt-2" style={{color: "#8b5cf6", fontWeight: 500, textAlign: "left"}}>
                    Debe coincidir con la contraseña.
                  </div>
                </div>
                {/* Botón de registro */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-gradient w-100 fw-bold py-2"
                  style={{background: "linear-gradient(90deg, #e83e8c, #6610f2)", color: "#fff"}}
                >
                  {loading ? 'Registrando...' : 'Registrarse'}
                </button>
              </form>
              <div className="mt-4 text-center">
                <span className="text-muted">¿Ya tienes una cuenta? </span>
                <a href="/login" className="fw-semibold text-decoration-none text-primary">Iniciar sesión</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
