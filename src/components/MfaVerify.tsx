import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MfaVerify = () => {
  const [token, setToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { verifyMfa, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirigir automáticamente al dashboard cuando esté autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError('Por favor ingresa el código de verificación');
      return;
    }
    
    try {
      setError(null);
      await verifyMfa(token);
      // Quitar navigate('/dashboard') de aquí, lo hace el useEffect
    } catch (err: any) {
      setError(err.message || 'Código inválido');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <div className="bg-gradient rounded-circle d-inline-flex align-items-center justify-content-center mb-2 shadow" style={{width: 64, height: 64}}>
                  {/* Nuevo icono: escudo MFA */}
                  <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z" stroke="#fff" strokeWidth="2"/>
                    <circle cx="12" cy="13" r="2.5" fill="#38bdf8"/>
                  </svg>
                </div>
                <h2 className="fw-bold text-info mb-1">Verificación de Dos Factores</h2>
                <p className="text-muted mb-0">Ingresa el código de 6 dígitos que recibiste en tu correo electrónico</p>
              </div>
              {error && (
                <div className="alert alert-danger">{error}</div>
              )}
              <form onSubmit={handleSubmit} className="mt-3">
                <div className="mb-3">
                  <label htmlFor="token" className="form-label fw-semibold">Código recibido por correo</label>
                  <input
                    type="text"
                    id="token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="000000"
                    className="form-control text-center fs-4"
                    maxLength={6}
                    autoComplete="one-time-code"
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-info w-100 fw-bold py-2"
                >
                  {loading ? 'Verificando...' : 'Verificar'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MfaVerify;
