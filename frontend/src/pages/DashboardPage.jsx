import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import userService from '../services/userService.js';

/**
 * Página principal del Dashboard (Vista Privada)
 * Estilo Notion/Stripe con widgets interactivos y datos reales
 */
const DashboardPage = () => {
  const { user } = useAuth();
  const [totalUsers, setTotalUsers] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await userService.getAllUsers();
        setTotalUsers(response.count || response.data?.length || 0);
        // Guardar los últimos 3 usuarios creados para mostrarlos en el widget "Actividad Reciente"
        const sorted = (response.data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setUsersList(sorted.slice(0, 3));
      } catch (error) {
        console.error('Error al cargar estadísticas en dashboard:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  // Formateador de fecha
  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Saludo de Bienvenida */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-2xl p-6 md:p-8 shadow-premium relative overflow-hidden">
        {/* Decoraciones abstractas en el fondo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
        
        <div className="relative z-10 max-w-2xl">
          <span className="bg-indigo-500/30 text-indigo-100 text-2xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Consola de Gestión
          </span>
          <h2 className="text-2xl md:text-3xl font-bold mt-3">
            ¡Hola, {user?.nombre} {user?.apellido}!
          </h2>
          <p className="mt-2 text-sm text-indigo-100 leading-relaxed">
            Te has autenticado correctamente en el sistema COTAL. Aquí podrás administrar el padrón completo de talentos y usuarios del sistema de forma segura y centralizada.
          </p>
        </div>
      </div>

      {/* 2. Tarjetas Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tarjeta 1: Total Usuarios */}
        <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-premium hover:shadow-premium-hover transition-all duration-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Usuarios Activos</p>
              <h3 className="text-3xl font-extrabold text-slate-800 mt-2">
                {loadingStats ? (
                  <span className="inline-block w-12 h-8 bg-slate-100 animate-pulse rounded-md"></span>
                ) : (
                  totalUsers
                )}
              </h3>
            </div>
            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span>Base de datos operativa</span>
          </div>
        </div>

        {/* Tarjeta 2: Perfil Actual */}
        <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-premium hover:shadow-premium-hover transition-all duration-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tu Credencial</p>
              <h4 className="text-base font-bold text-slate-800 mt-3 truncate max-w-[180px]">
                {user?.nombre} {user?.apellido}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[180px]">{user?.email}</p>
            </div>
            <div className={`p-2.5 rounded-xl border text-xs font-bold ${
              user?.rol === 'ADMIN' ? 'bg-indigo-50 border-indigo-100 text-indigo-700' :
              user?.rol === 'HOST' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
              'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              {user?.rol}
            </div>
          </div>
          <div className="mt-5 text-2xs font-semibold text-slate-400 uppercase tracking-wide">
            Rol asignado para control de accesos
          </div>
        </div>

        {/* Tarjeta 3: Acceso Directo */}
        <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-premium hover:shadow-premium-hover transition-all duration-200 flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Administración</p>
            <p className="text-xs text-slate-500 mt-2">
              Accede al gestor tabular para visualizar, crear, editar o eliminar cuentas de usuario.
            </p>
          </div>
          <Link
            to="/users"
            className="mt-4 inline-flex items-center justify-center gap-2 w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow active:scale-98 transition-all"
          >
            <span>Ver Listado Completo</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* 3. Panel de Actividad Reciente & Datos Rápidos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actividad Reciente */}
        <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-premium">
          <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Últimos Registros</h3>
          {loadingStats ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-12 bg-slate-50 animate-pulse rounded-xl"></div>
              ))}
            </div>
          ) : usersList.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No hay registros de actividad todavía.</p>
          ) : (
            <div className="space-y-3">
              {usersList.map((usr) => (
                <div key={usr.id} className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-100 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs">
                      {usr.nombre[0]}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{usr.nombre} {usr.apellido}</p>
                      <p className="text-3xs text-slate-400">{usr.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-1.5 py-0.5 text-3xs font-bold rounded bg-white border border-slate-200 text-slate-600 mb-1">
                      {usr.rol}
                    </span>
                    <p className="text-3xs text-slate-400">{formatDate(usr.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Guía Rápida / Recordatorio */}
        <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-premium flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Flujo de Roles de COTAL</h3>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0"></span>
                <p>
                  <strong className="text-slate-800">USER:</strong> Rol para el talento local. Permite la autogestión de perfil, búsqueda y postulaciones a proyectos.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></span>
                <p>
                  <strong className="text-slate-800 font-semibold">HOST:</strong> Rol para el anfitrión que publica ofertas, coordina y contrata talentos en la comunidad.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></span>
                <p>
                  <strong className="text-slate-800">ADMIN:</strong> Privilegios de nivel de sistema para auditoría completa y control del CRUD de cuentas.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 p-3 bg-indigo-50/50 border border-indigo-100/50 rounded-xl text-3xs text-indigo-700 leading-normal">
            <strong>Nota universitaria:</strong> Este panel demuestra la integración reactiva consumiendo la API REST con Axios y persistiendo tokens en localStorage.
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
