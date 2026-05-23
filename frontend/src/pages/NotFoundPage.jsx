import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

/**
 * Página 404 — Ruta no encontrada
 * Diseño minimalista premium, responsivo
 */
const NotFoundPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-100 via-slate-50 to-indigo-50/30 px-4">
      <div className="max-w-md w-full text-center">
        {/* Número 404 decorativo */}
        <div className="relative mb-6">
          <span className="text-[8rem] sm:text-[10rem] font-black text-slate-100 select-none leading-none block">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-white rounded-2xl shadow-premium border border-slate-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Texto */}
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Página no encontrada
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed mb-8">
          La ruta que estás buscando no existe o fue movida a otra ubicación.
          Verifica la URL o regresa a un lugar seguro.
        </p>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 rounded-xl text-sm font-semibold text-slate-600 transition-all shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Página anterior
          </button>

          <Link
            to={isAuthenticated ? '/dashboard' : '/login'}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-sm font-semibold text-white transition-all shadow-sm hover:shadow active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {isAuthenticated ? 'Ir al Dashboard' : 'Iniciar Sesión'}
          </Link>
        </div>

        {/* Logo COTAL */}
        <div className="mt-12 flex items-center justify-center gap-2 text-slate-400">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
            C
          </div>
          <span className="text-xs font-semibold tracking-tight">COTAL — Conecta de Talentos Locales</span>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
