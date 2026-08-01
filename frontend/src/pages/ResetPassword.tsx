import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api';

type Status = 'form' | 'success' | 'error';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<Status>('form');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setError('Token de recuperación no proporcionado.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      await api.post('/auth/reset-password', { token, newPassword: password });
      setStatus('success');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al restablecer la contraseña';
      setError(msg);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-8 py-10 text-center">
            <h1 className="text-xl font-semibold text-gray-900 mb-4">
              Contraseña Actualizada
            </h1>
            <p className="text-sm text-green-600 mb-6">
              Tu contraseña ha sido restablecida exitosamente.
            </p>
            <Link
              to="/login"
              className="inline-block px-4 py-2 text-sm font-medium rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors"
            >
              Ir a Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error' && !token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-8 py-10 text-center">
            <h1 className="text-xl font-semibold text-gray-900 mb-4">
              Error
            </h1>
            <p className="text-sm text-red-500 mb-6">{error}</p>
            <Link
              to="/login"
              className="inline-block px-4 py-2 text-sm font-medium rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors"
            >
              Volver al Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-8 py-10">
          <h1 className="text-xl font-semibold text-gray-900 text-center mb-8">
            Nueva Contraseña
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Nueva Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300"
                placeholder="Repite tu contraseña"
              />
            </div>

            {error && status === 'error' && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-gray-900 text-white text-sm font-medium rounded-lg px-4 py-2.5 hover:bg-gray-800 transition-colors"
            >
              Restablecer Contraseña
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;