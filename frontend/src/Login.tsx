import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from './api';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || '';
      if (status === 403 || msg.includes('verificada') || msg.includes('activa')) {
        setError('Tu cuenta aún no está verificada. Revisa tu correo electrónico.');
      } else {
        setError('Credenciales inválidas');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-8 py-10">
          <h1 className="text-xl font-semibold text-gray-900 text-center mb-8">
            Iniciar Sesión
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
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
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300"
                placeholder="••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-gray-900 text-white text-sm font-medium rounded-lg px-4 py-2.5 hover:bg-gray-800 transition-colors"
            >
              Entrar
            </button>
          </form>

          <p className="mt-4 text-sm text-gray-400 text-center">
            <Link to="/forgot-password" className="text-gray-700 hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </p>
          <p className="mt-2 text-sm text-gray-400 text-center">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-gray-700 hover:underline">
              Registrarse
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;