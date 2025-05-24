import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const MfaSetup = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { setupMfa } = useAuth();

  useEffect(() => {
    const initMfaSetup = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Obtener datos de configuración MFA
        const { qrCode, secret } = await setupMfa();
        setQrCode(qrCode);
        setSecret(secret);
      } catch (err: any) {
        setError(err.message || 'Error al configurar MFA');
      } finally {
        setLoading(false);
      }
    };

    initMfaSetup();
  }, [setupMfa]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{height: '60vh'}}>
        <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center">
          <p>Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn btn-danger mt-2"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-md-7 col-lg-6">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <div className="bg-gradient rounded-circle d-inline-flex align-items-center justify-content-center mb-2 shadow" style={{width: 64, height: 64}}>
                  {/* Nuevo icono: escudo con llave */}
                  <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z" stroke="#fff" strokeWidth="2"/>
                    <path d="M12 13v2m0 0h2m-2 0h-2" stroke="#22c55e" strokeWidth="2"/>
                  </svg>
                </div>
                <h2 className="fw-bold text-success mb-1">Configurar Autenticación de Dos Factores</h2>
                <p className="text-muted mb-0">Escanea el código QR o ingresa el código manualmente en tu app de autenticación</p>
              </div>
              <div className="mb-4">
                <p className="text-muted mb-3">
                  Escanea el código QR con tu aplicación de autenticación (Google Authenticator, Authy, etc).
                </p>
                {qrCode && (
                  <div className="d-flex justify-content-center mb-3">
                    <img src={qrCode} alt="Código QR para MFA" className="border p-2 rounded" />
                  </div>
                )}
                {secret && (
                  <div className="mt-3">
                    <p className="text-muted mb-2">O ingresa manualmente este código en tu aplicación:</p>
                    <div className="bg-light p-3 rounded text-center font-monospace">{secret}</div>
                  </div>
                )}
              </div>
              <div className="alert alert-warning d-flex align-items-center mb-4" role="alert">
                {/* Nuevo icono de advertencia */}
                <svg className="flex-shrink-0 me-2" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke="#facc15" strokeWidth="2"/><path d="M12 8v4m0 4h.01" stroke="#facc15" strokeWidth="2"/></svg>
                <div>
                  <strong>¡Importante!</strong> Guarda estos códigos de respaldo en un lugar seguro. Si pierdes acceso a tu aplicación de autenticación, necesitarás estos códigos para recuperar tu cuenta.
                </div>
              </div>
              <div className="text-center">
                <a 
                  href="/dashboard" 
                  className="btn btn-success btn-lg w-100 fw-bold"
                >
                  Continuar
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MfaSetup;
