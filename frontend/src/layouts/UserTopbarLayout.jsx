import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

/* Ícono de logo COTAL */
const CotalLogo = () => (
  <div className="relative w-8 h-8 flex-shrink-0">
    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 flex items-center justify-center shadow-glow-indigo">
      <span className="text-white font-display font-bold text-base leading-none select-none">C</span>
    </div>
    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white" />
  </div>
);

const UserAvatar = ({ user }) => (
  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 text-white flex items-center justify-center font-bold text-xs shadow-sm flex-shrink-0">
    {user?.nombre?.[0]}{user?.apellido?.[0]}
  </div>
);

const UserTopbarLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { name: 'Explorar Servicios', href: '/services/explore' },
    { name: 'Mis Solicitudes', href: '/my-requests' },
    { name: 'Mensajes', href: '/messages' },
    { name: 'Mi Actividad', href: '/my-overview' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col">
      {/* ── HEADER SUPERIOR ── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100/80 shadow-sm transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo + Branding */}
          <Link to="/services/explore" className="flex items-center gap-3 group">
            <CotalLogo />
            <div>
              <span className="font-display font-extrabold text-[15px] tracking-tight text-slate-900 block leading-none group-hover:text-indigo-600 transition-colors">
                COTAL
              </span>
              <span className="text-[10px] text-slate-400 font-medium leading-none mt-0.5 block">
                Comunidad de Talentos
              </span>
            </div>
          </Link>

          {/* Navegación Horizontal (Desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-150
                    ${active
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/80'
                    }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Acciones del Usuario (Desktop) */}
          <div className="hidden md:flex items-center gap-4 relative">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-2xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse inline-block" />
              Sesión Activa
            </span>

            {/* Menú Dropdown del Perfil */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 hover:bg-slate-50 p-1.5 rounded-xl transition-all cursor-pointer"
              >
                <UserAvatar user={user} />
                <div className="text-left hidden lg:block leading-tight">
                  <p className="text-xs font-semibold text-slate-800 truncate max-w-[100px]">{user?.nombre}</p>
                  <p className="text-3xs text-slate-400 font-bold uppercase tracking-wider">{user?.rol}</p>
                </div>
                <svg className={`w-3 h-3 text-slate-400 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {profileDropdownOpen && (
                <>
                  {/* Overlay invisible para cerrar el dropdown al hacer click fuera */}
                  <div className="fixed inset-0 z-30" onClick={() => setProfileDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-40 animate-scaleIn">
                    <div className="px-4 py-2 border-b border-slate-50">
                      <p className="text-xs font-bold text-slate-800">{user?.nombre} {user?.apellido}</p>
                      <p className="text-2xs text-slate-400 truncate mt-0.5">{user?.email}</p>
                    </div>
                    <Link
                      to="/my-overview"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="block px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
                    >
                      Mi Actividad
                    </Link>
                    <button
                      onClick={() => { setProfileDropdownOpen(false); handleLogout(); }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50/50 transition-all border-t border-slate-50 mt-1"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Hamburguesa (Mobile) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </header>

      {/* Navegación Móvil (Drawer/Dropdown) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 shadow-lg py-4 px-6 space-y-3 animate-slideUp">
          <div className="space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-xl text-xs font-semibold transition-all
                    ${active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <UserAvatar user={user} />
              <div>
                <p className="text-xs font-bold text-slate-800">{user?.nombre}</p>
                <p className="text-3xs text-slate-400 font-bold uppercase tracking-wider">{user?.rol}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 text-2xs font-bold rounded-xl transition-all"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}

      {/* ── CONTENIDO PRINCIPAL ── */}
      <main className={`flex-1 w-full overflow-hidden ${
        location.pathname === '/messages'
          ? ''
          : 'max-w-7xl mx-auto p-4 md:p-6 lg:p-8'
      }`}>
        <Outlet />
      </main>
    </div>
  );
};

export default UserTopbarLayout;
