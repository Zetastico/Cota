import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

/**
 * Componente Wrapper para restringir el acceso a rutas privadas
 * @param {ReactNode} children - Vista interna a proteger
 * @param {Array<string>} allowedRoles - Lista opcional de roles admitidos
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();

  // 1. Mostrar pantalla de carga elegante mientras restaura el token
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="relative w-12 h-12">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-100 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="mt-4 text-sm font-medium text-slate-500 animate-pulse">
          Estableciendo conexión segura...
        </p>
      </div>
    );
  }

  // 2. Redireccionar al login si no se encuentra autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. Bloquear acceso si el usuario no tiene un rol válido para este recurso
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl shadow-premium border border-slate-100">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500">
            {/* Icono de escudo de seguridad */}
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0-6v2m0-6H9.75A2.25 2.25 0 0 0 7.5 9.75v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H12Z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Acceso Restringido</h2>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            Tu rol actual (<span className="font-semibold text-slate-700">{user.rol}</span>) no tiene los privilegios necesarios para ver esta página.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg active:scale-95 transition-all duration-200"
          >
            Volver al Inicio
          </a>
        </div>
      </div>
    );
  }

  // 4. Renderizar el componente protegido
  return children;
};

export default ProtectedRoute;
