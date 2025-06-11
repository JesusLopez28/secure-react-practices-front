import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Dashboard = () => {
  const { user, logout, isAuthenticated, requiresMfa } = useAuth();
  const navigate = useNavigate();

  // Redirigir si no está autenticado o si requiere MFA
  useEffect(() => {
    if (!isAuthenticated || requiresMfa) {
      navigate('/login');
    }
  }, [isAuthenticated, requiresMfa, navigate]);

  if (!isAuthenticated || requiresMfa) {
    return null;
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center min-vh-100">
        <div className="col-lg-10">
          <div className="card shadow border-0 rounded-3">
            <div className="card-body p-4 p-lg-5">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fw-bold text-primary d-flex align-items-center gap-2 mb-0">
                  {/* Icono dashboard */}
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <rect x="3" y="11" width="7" height="9" rx="2" stroke="#6366f1" strokeWidth="2"/>
                    <rect x="14" y="3" width="7" height="17" rx="2" stroke="#3b82f6" strokeWidth="2"/>
                  </svg>
                  Panel Principal
                </h1>
                <button
                  onClick={logout}
                  className="btn btn-outline-danger fw-bold"
                >
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="me-2">
                    <path d="M15 12H3m0 0l4-4m-4 4l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <rect x="9" y="4" width="12" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Cerrar sesión
                </button>
              </div>
              <div className="alert alert-primary d-flex align-items-center mb-4" role="alert">
                {/* Icono usuario */}
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="me-2">
                  <circle cx="12" cy="8" r="4" stroke="#3b82f6" strokeWidth="2"/>
                  <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke="#3b82f6" strokeWidth="2"/>
                </svg>
                <div>
                  Bienvenido, <strong>{user?.username}</strong>. Has iniciado sesión exitosamente.
                </div>
              </div>
              <div className="row g-4 mb-4">
                <div className="col-md-6">
                  <div className="card border h-100">
                    <div className="card-body">
                      <h2 className="h5 fw-bold text-primary mb-3 d-flex align-items-center gap-2">
                        {/* Icono perfil */}
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <circle cx="12" cy="8" r="4" stroke="#6366f1" strokeWidth="2"/>
                          <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke="#6366f1" strokeWidth="2"/>
                        </svg>
                        Perfil de Usuario
                      </h2>
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item"><span className="fw-semibold">Usuario:</span> {user?.username}</li>
                        <li className="list-group-item"><span className="fw-semibold">Email:</span> {user?.email}</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card border h-100">
                    <div className="card-body">
                      <h2 className="h5 fw-bold text-success mb-3 d-flex align-items-center gap-2">
                        {/* Icono escudo MFA */}
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z" stroke="#10b981" strokeWidth="2"/>
                          <circle cx="12" cy="13" r="2.5" fill="#10b981"/>
                        </svg>
                        Seguridad
                      </h2>
                      <div className="mb-3">
                        <h6 className="fw-semibold">Autenticación de Dos Factores</h6>
                        <p className="small text-muted mb-2">
                          La autenticación de dos factores añade una capa adicional de seguridad a tu cuenta. Recibirás un código por correo electrónico al iniciar sesión.
                        </p>
                        <button
                          className="btn btn-outline-success btn-sm fw-bold"
                          disabled
                        >
                          2FA por correo activado
                        </button>
                      </div>
                      <div>
                        <h6 className="fw-semibold">Cambiar Contraseña</h6>
                        <p className="small text-muted mb-2">
                          Es recomendable cambiar tu contraseña regularmente.
                        </p>
                        <button
                          className="btn btn-outline-primary btn-sm fw-bold"
                        >
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="me-1">
                            <rect x="5" y="11" width="14" height="8" rx="3" stroke="#6366f1" strokeWidth="2"/>
                            <path d="M8 11V8a4 4 0 018 0v3" stroke="#6366f1" strokeWidth="2"/>
                          </svg>
                          Cambiar contraseña
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card border mb-0">
                <div className="card-body">
                  <h2 className="h5 fw-bold text-danger mb-3 d-flex align-items-center gap-2">
                    {/* Icono escudo info */}
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2"/>
                      <path d="M12 8v4m0 4h.01" stroke="#ef4444" strokeWidth="2"/>
                    </svg>
                    Información de Seguridad
                  </h2>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <h6 className="fw-semibold mb-1">ISO/IEC 27001 - Gestión de la Seguridad de la Información</h6>
                      <span className="small text-muted">
                        Nuestra aplicación sigue los estándares internacionales para proteger la confidencialidad, integridad y disponibilidad de la información.
                      </span>
                    </li>
                    <li className="list-group-item">
                      <h6 className="fw-semibold mb-1">ISO/IEC 27002 - Gestión de Contraseñas</h6>
                      <span className="small text-muted">
                        Implementamos políticas de seguridad para contraseñas según el control A.9.2.4 para garantizar la efectividad y seguridad.
                      </span>
                    </li>
                    <li className="list-group-item">
                      <h6 className="fw-semibold mb-1">NIST SP 800-63B - Autenticación Digital</h6>
                      <span className="small text-muted">
                        Nuestra implementación de autenticación multifactor sigue las pautas establecidas por el Instituto Nacional de Normas y Tecnología.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
