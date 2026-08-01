import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api';

type Status = 'loading' | 'success' | 'error';

function VerifyAccount() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token de verificación no proporcionado.');
      return;
    }

    api.get(`/auth/verify?token=${token}`)
      .then(() => {
        setStatus('success');
        setMessage('¡Cuenta verificada exitosamente! Ahora puedes iniciar sesión.');
      })
      .catch(() => {
        setStatus('error');
        setMessage('El token de verificación es inválido o ha expirado.');
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-8 py-10 text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">
            Verificación de Cuenta
          </h1>

          {status === 'loading' && (
            <p className="text-sm text-gray-500">Verificando tu cuenta...</p>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <p className="text-sm text-green-600">{message}</p>
              <Link
                to="/login"
                className="inline-block px-4 py-2 text-sm font-medium rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors"
              >
                Ir a Iniciar Sesión
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <p className="text-sm text-red-500">{message}</p>
              <Link
                to="/login"
                className="inline-block px-4 py-2 text-sm font-medium rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors"
              >
                Volver al Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyAccount;