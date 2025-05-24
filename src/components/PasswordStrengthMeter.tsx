import { useState, useEffect } from 'react';

interface PasswordStrengthMeterProps {
  password: string;
}

const PasswordStrengthMeter = ({ password }: PasswordStrengthMeterProps) => {
  const [strength, setStrength] = useState<number>(0);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    // Calcular la fortaleza de la contraseña
    const calculateStrength = () => {
      if (!password) {
        setStrength(0);
        setMessage('');
        return;
      }

      let score = 0;
      
      // Criterios según ISO/IEC 27002 - A.9.2.4
      if (password.length >= 10) score += 1;
      if (password.length >= 12) score += 1;
      if (/[A-Z]/.test(password)) score += 1;
      if (/[a-z]/.test(password)) score += 1;
      if (/\d/.test(password)) score += 1;
      if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;

      // Ajustar mensaje basado en la puntuación
      if (score === 0 || password.length < 8) {
        setStrength(0);
        setMessage('Insegura');
      } else if (score <= 2) {
        setStrength(1);
        setMessage('Débil');
      } else if (score <= 4) {
        setStrength(2);
        setMessage('Media');
      } else {
        setStrength(3);
        setMessage('Fuerte');
      }
    };

    calculateStrength();
  }, [password]);

  // Determinar el color basado en la fortaleza (Bootstrap)
  const getColor = () => {
    switch (strength) {
      case 0: return 'bg-danger';
      case 1: return 'bg-warning';
      case 2: return 'bg-info';
      case 3: return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  const getTextColor = () => {
    switch (strength) {
      case 0: return '#ef4444';
      case 1: return '#facc15';
      case 2: return '#38bdf8';
      case 3: return '#22c55e';
      default: return '#a1a1aa';
    }
  };

  // No mostrar nada si no hay contraseña
  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="progress" style={{height: 6}}>
        <div
          className={`progress-bar ${getColor()}`}
          role="progressbar"
          style={{ width: `${(strength / 3) * 100}%` }}
          aria-valuenow={strength}
          aria-valuemin={0}
          aria-valuemax={3}
        ></div>
      </div>
      <div className="small mt-1 fw-semibold" style={{color: getTextColor()}}>
        {message}
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
