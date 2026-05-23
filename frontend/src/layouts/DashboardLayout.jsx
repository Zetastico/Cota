import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

/**
 * Layout principal de la sección privada (Dashboard)
 * Provee Sidebar responsivo (colapsable), Navbar superior y unificación visual.
 */
const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Enlaces de navegación con iconos SVG inline
  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      name: 'Usuarios',
      href: '/users',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
  ];

  // Helper para detectar ruta activa
  const isActive = (path) => location.pathname === path;

  // Renderizador de un Badge de rol con colores estilizados
  const renderRoleBadge = (role) => {
    const styles = {
      ADMIN: 'bg-indigo-50 text-indigo-700 border-indigo-150',
      HOST: 'bg-emerald-50 text-emerald-700 border-emerald-150',
      USER: 'bg-slate-100 text-slate-700 border-slate-200',
    };
    return (
      <span className={`px-2 py-0.5 text-2xs font-semibold rounded border ${styles[role] || styles.USER}`}>
        {role}
      </span>
    );
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800">
      {/* 1. SIDEBAR DESKTOP */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-slate-150 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Header de Sidebar */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm flex-shrink-0">
              C
            </div>
            {!isCollapsed && (
              <span className="font-bold text-base tracking-tight text-slate-900 animate-fadeIn">
                COTAL
              </span>
            )}
          </div>
          
          {/* Botón de Colapsar (Notion-style toggle) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title={isCollapsed ? "Expandir panel" : "Colapsar panel"}
          >
            <svg className={`w-5 h-5 transform transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Menú de Navegación */}
        <nav className="flex-1 py-6 px-3 space-y-1">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  active
                    ? 'bg-indigo-50/70 text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {item.icon}
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer del Sidebar con perfil de Usuario */}
        {user && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
              <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                {user.nombre[0]}
                {user.apellido[0]}
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">
                    {user.nombre} {user.apellido}
                  </p>
                  <p className="text-2xs text-slate-400 truncate mb-1">{user.email}</p>
                  {renderRoleBadge(user.rol)}
                </div>
              )}
            </div>
            
            {!isCollapsed && (
              <button
                onClick={handleLogout}
                className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 border border-slate-200 hover:border-rose-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50/30 rounded-xl text-xs font-medium transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Cerrar Sesión
              </button>
            )}
          </div>
        )}
      </aside>

      {/* 2. SIDEBAR MOBILE (SLIDEOVER) */}
      <div className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setMobileOpen(false)}></div>
        
        <aside
          className={`absolute inset-y-0 left-0 w-64 bg-white flex flex-col transition-transform duration-300 transform ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
            <span className="font-bold text-lg tracking-tight text-slate-900">COTAL</span>
            <button onClick={() => setMobileOpen(false)} className="p-1 rounded-md text-slate-400 hover:text-slate-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 py-6 px-3 space-y-1">
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                    active ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {user && (
            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-sm">
                  {user.nombre[0]}
                  {user.apellido[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">{user.nombre} {user.apellido}</p>
                  <p className="text-2xs text-slate-400 truncate mb-1">{user.email}</p>
                  {renderRoleBadge(user.rol)}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2.5 border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-medium transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Cerrar Sesión
              </button>
            </div>
          )}
        </aside>
      </div>

      {/* 3. CONTENEDOR PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar superior */}
        <header className="h-16 bg-white border-b border-slate-150 flex items-center justify-between px-4 md:px-8 flex-shrink-0 z-10">
          <div className="flex items-center gap-3">
            {/* Botón de hamburguesa móvil */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-base font-bold text-slate-800 capitalize">
              {location.pathname.split('/')[1] || 'Inicio'}
            </h1>
          </div>

          {/* Acciones de usuario rápidas */}
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-xs text-slate-400">
              Entorno: <span className="font-semibold text-slate-500">Desarrollo local</span>
            </span>
            {user && (
              <div className="md:hidden w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {user.nombre[0]}
              </div>
            )}
          </div>
        </header>

        {/* Panel de contenido con Scroll */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
