import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from './api';

type Status = 'form' | 'success' | 'error';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState<Status>('form');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await api.post('/auth/register', { email, password, firstName, lastName });
      setStatus('success');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al registrarse';
      setError(msg);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-8 py-10">
          <h1 className="text-xl font-semibold text-gray-900 text-center mb-8">
            Crear Cuenta
          </h1>

          {status === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Nombre</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300"
                  placeholder="Nombre"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Apellido</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300"
                  placeholder="Apellido"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Contraseña</label>
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

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              <button
                type="submit"
                className="w-full bg-gray-900 text-white text-sm font-medium rounded-lg px-4 py-2.5 hover:bg-gray-800 transition-colors"
              >
                Registrarse
              </button>
            </form>
          )}

          {status === 'success' && (
            <div className="text-center space-y-4">
              <div className="text-green-600 text-sm">
                ¡Registro exitoso! Hemos enviado un enlace de verificación a tu correo.
                Por favor, verifica tu cuenta para poder iniciar sesión.
              </div>
              <Link
                to="/login"
                className="inline-block px-4 py-2 text-sm font-medium rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors"
              >
                Ir a Iniciar Sesión
              </Link>
            </div>
          )}

          <p className="mt-6 text-sm text-gray-400 text-center">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-gray-700 hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;