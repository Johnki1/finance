import { Link, useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar simple */}
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900 tracking-tight">
            Finanzas
          </span>
          <nav className="flex items-center gap-4">
            {token ? (
              <>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Cerrar Sesión
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Ir al Dashboard
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Registrarse
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-16 text-center">
        <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 tracking-tight leading-tight">
          Gestiona tus Finanzas <br />
          <span className="text-gray-400">sin Esfuerzo</span>
        </h1>
        <p className="mt-6 text-lg text-gray-400 max-w-xl mx-auto leading-relaxed">
          Registra tus ingresos, controla tus gastos fijos y variables, y obtén
          una visión clara de tu salud financiera en tiempo real.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          {token ? (
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto bg-gray-900 text-white text-sm font-medium px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
              >
                Ir al Dashboard
              </button>
              <button
                onClick={() => navigate('/reports')}
                className="w-full sm:w-auto text-sm text-gray-700 border border-gray-200 px-6 py-3 rounded-lg hover:border-gray-300 hover:text-gray-900 transition-colors"
              >
                Ver Reportes
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/register"
                className="w-full sm:w-auto bg-gray-900 text-white text-sm font-medium px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
              >
                Comenzar Gratis
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto text-sm text-gray-500 border border-gray-200 px-6 py-3 rounded-lg hover:border-gray-300 hover:text-gray-700 transition-colors"
              >
                Iniciar Sesión
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Características */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              Control de Ingresos
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Registra múltiples fuentes de ingreso y visualiza tu flujo de
              dinero mensual.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              Gastos Fijos
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Categoriza y da seguimiento a tus suscripciones, renta y demás
              gastos recurrentes.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              Gastos Variables
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Controla tus compras del día a día y mantén tus finanzas
              personales bajo control.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <p className="text-center text-xs text-gray-300">
          &copy; {new Date().getFullYear()} Finanza. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}

export default LandingPage;