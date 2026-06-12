import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import statsService from '../services/statsService.js';

/* ─────────────────────────────────────────────────────────────────────────
   DashboardLayout — Sidebar SaaS premium estilo Linear / Vercel / Notion
   Solo visual. Cero cambios en lógica, rutas o autenticación.
───────────────────────────────────────────────────────────────────────── */

/* Ícono de logo COTAL */
const CotalLogo = () => (
  <div className="relative w-8 h-8 flex-shrink-0">
    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 flex items-center justify-center shadow-glow-indigo">
      <span className="text-white font-display font-bold text-base leading-none select-none">C</span>
    </div>
    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white" />
  </div>
);

/* Avatar de usuario con iniciales y gradiente */
const UserAvatar = ({ user, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
  };
  const gradient = user?.rol === 'ADMIN'
    ? 'from-indigo-500 to-indigo-600'
    : user?.rol === 'HOST'
    ? 'from-emerald-500 to-emerald-600'
    : 'from-slate-400 to-slate-500';

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${gradient} text-white flex items-center justify-center font-bold flex-shrink-0 shadow-sm`}>
      {user?.nombre?.[0]}{user?.apellido?.[0]}
    </div>
  );
};

/* Badge de rol */
const RoleBadge = ({ role }) => {
  const variants = {
    ADMIN: 'bg-indigo-50 text-indigo-600 border-indigo-100 ring-1 ring-indigo-200/50',
    HOST:  'bg-emerald-50 text-emerald-600 border-emerald-100 ring-1 ring-emerald-200/50',
    USER:  'bg-slate-100 text-slate-500 border-slate-200',
  };
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-2xs font-bold border tracking-wide ${variants[role] || variants.USER}`}>
      {role}
    </span>
  );
};

/* Ícono SVG de menú — centralizado */
const NavIcon = ({ d }) => (
  <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={d} />
  </svg>
);

const ICONS = {
  dashboard:  'M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
  users:      'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  services:   'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  pending:    'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
  explore:    'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  requests:   'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
  myRequests: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
  logout:     'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
  messages:   'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  chevronLeft:'M11 19l-7-7 7-7m8 14l-7-7 7-7',
  menu:       'M4 6h16M4 12h16M4 18h16',
  close:      'M6 18L18 6M6 6l12 12',
};

/* Construye el array de navegación según rol */
const buildNavigation = (role) => {
  const base = [
    { name: 'Dashboard', href: '/dashboard', icon: 'dashboard', group: 'general' },
  ];

  if (role === 'ADMIN') {
    return [
      ...base,
      { name: 'Usuarios', href: '/users', icon: 'users', group: 'administración' },
      { name: 'Servicios Pendientes', href: '/services/pending', icon: 'pending', group: 'administración' },
    ];
  }
  if (role === 'HOST') {
    return [
      ...base,
      { name: 'Mis Servicios', href: '/services', icon: 'services', group: 'gestión' },
      { name: 'Solicitudes Recibidas', href: '/service-requests', icon: 'requests', group: 'gestión' },
      { name: 'Mensajes', href: '/messages', icon: 'messages', group: 'comunicación' },
    ];
  }
  if (role === 'USER') {
    return [
      ...base,
      { name: 'Explorar Servicios', href: '/services/explore', icon: 'explore', group: 'descubrir' },
      { name: 'Mis Solicitudes', href: '/my-requests', icon: 'myRequests', group: 'descubrir' },
    ];
  }
  return base;
};

/* Componente de enlace de navegación */
const NavLink = ({ item, isActive, isCollapsed, onClick }) => {
  const active = isActive(item.href);
  return (
    <Link
      to={item.href}
      onClick={onClick}
      title={isCollapsed ? item.name : undefined}
      className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
        font-medium transition-all duration-150 outline-none
        ${active
          ? 'bg-indigo-50 text-indigo-700 shadow-[inset_3px_0_0_#4F46E5]'
          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/80'
        }`}
    >
      {/* Ícono */}
      <span className={`transition-transform duration-150 group-hover:scale-105 ${active ? 'text-indigo-600' : ''}`}>
        <NavIcon d={ICONS[item.icon]} />
      </span>

      {/* Label (oculto en modo colapsado) */}
      {!isCollapsed && (
        <span className="truncate transition-all animate-slideIn">{item.name}</span>
      )}

      {/* Punto indicador activo cuando está colapsado */}
      {isCollapsed && active && (
        <span className="absolute right-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-indigo-600" />
      )}
    </Link>
  );
};

/* Separador de grupo */
const NavGroupLabel = ({ label, isCollapsed }) => {
  if (isCollapsed) return <div className="my-2 border-t border-slate-100 mx-2" />;
  return (
    <p className="px-3 pt-4 pb-1.5 text-2xs font-bold text-slate-400 uppercase tracking-widest">
      {label}
    </p>
  );
};

/* ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────── */
const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [hasAlerts, setHasAlerts] = useState(false);

  useEffect(() => {
    if (!user) return;
    statsService.getDashboardStats()
      .then(res => {
        if (res.success && res.data?.stats) {
          const s = res.data.stats;
          if (user.rol === 'ADMIN' && s.pendingServices > 0) {
            setHasAlerts(true);
          } else if (user.rol === 'HOST' && s.pendingRequestsReceived > 0) {
            setHasAlerts(true);
          } else if (user.rol === 'USER' && s.acceptedRequests > 0) {
            setHasAlerts(true);
          }
        }
      })
      .catch(err => console.error(err));
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navigation = buildNavigation(user?.rol);

  // Agrupa las rutas por grupo
  const groups = navigation.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  /* ── Sidebar Content (reutilizado en desktop + mobile) ── */
  const SidebarContent = ({ collapsed = false, onNavClick }) => (
    <div className="flex flex-col h-full">

      {/* Logo + Toggle */}
      <div className={`h-16 flex items-center border-b border-slate-100 ${collapsed ? 'justify-center px-4' : 'justify-between px-5'}`}>
        <div className="flex items-center gap-3 overflow-hidden min-w-0">
          <CotalLogo />
          {!collapsed && (
            <div className="min-w-0 animate-slideIn">
              <span className="font-display font-bold text-[15px] tracking-tight text-slate-900 block leading-none">
                COTAL
              </span>
              <span className="text-2xs text-slate-400 font-medium leading-none mt-0.5 block">
                Plataforma de servicios
              </span>
            </div>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors flex-shrink-0"
            title="Colapsar"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ICONS.chevronLeft} />
            </svg>
          </button>
        )}
        {collapsed && (
          <button
            onClick={() => setIsCollapsed(false)}
            className="absolute bottom-auto top-[1.15rem] right-0 translate-x-1/2 z-10 w-6 h-6 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
            title="Expandir"
          >
            <svg className="w-3 h-3 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={ICONS.chevronLeft} />
            </svg>
          </button>
        )}
      </div>

      {/* Navegación agrupada */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {Object.entries(groups).map(([group, items], idx) => (
          <div key={group}>
            {idx > 0 && <NavGroupLabel label={group} isCollapsed={collapsed} />}
            {idx === 0 && !collapsed && (
              <NavGroupLabel label={group} isCollapsed={collapsed} />
            )}
            {items.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                isActive={isActive}
                isCollapsed={collapsed}
                onClick={onNavClick}
              />
            ))}
          </div>
        ))}
      </nav>

      {/* User card en footer */}
      {user && (
        <div className={`border-t border-slate-100 p-3 ${collapsed ? 'flex flex-col items-center gap-2' : ''}`}>
          {!collapsed ? (
            /* Expandido */
            <div>
              <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-default">
                <UserAvatar user={user} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate leading-tight">
                    {user.nombre} {user.apellido}
                  </p>
                  <p className="text-2xs text-slate-400 truncate leading-tight mt-0.5">
                    {user.email}
                  </p>
                  <div className="mt-1">
                    <RoleBadge role={user.rol} />
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl
                  text-slate-500 hover:text-rose-600 hover:bg-rose-50/60 border border-transparent
                  hover:border-rose-100 text-xs font-medium transition-all duration-150"
              >
                <NavIcon d={ICONS.logout} />
                Cerrar Sesión
              </button>
            </div>
          ) : (
            /* Colapsado */
            <>
              <UserAvatar user={user} size="md" />
              <button
                onClick={handleLogout}
                title="Cerrar sesión"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <NavIcon d={ICONS.logout} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );

  /* Título del header basado en la ruta actual */
  const pageTitle = (() => {
    const nav = navigation.find((n) => location.pathname.startsWith(n.href) && n.href !== '/dashboard');
    if (nav) return nav.name;
    if (location.pathname === '/dashboard') return 'Dashboard';
    return location.pathname.split('/').filter(Boolean).pop()?.replace(/-/g, ' ') || 'Inicio';
  })();

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-slate-800">

      {/* ── SIDEBAR DESKTOP ─────────────────────────────────────────── */}
      <aside
        className={`relative hidden md:flex flex-col bg-white border-r border-slate-100
          transition-all duration-300 ease-in-out flex-shrink-0
          ${isCollapsed ? 'w-[68px]' : 'w-64'}`}
        style={{ boxShadow: '1px 0 0 #f1f5f9' }}
      >
        <SidebarContent collapsed={isCollapsed} onNavClick={undefined} />
      </aside>

      {/* ── SIDEBAR MOBILE (DRAWER) ─────────────────────────────────── */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300
          ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
        {/* Drawer */}
        <aside
          className={`absolute inset-y-0 left-0 w-72 bg-white flex flex-col shadow-2xl
            transition-transform duration-300 ease-in-out
            ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          {/* Botón cerrar (mobile) */}
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ICONS.close} />
            </svg>
          </button>
          <SidebarContent collapsed={false} onNavClick={() => setMobileOpen(false)} />
        </aside>
      </div>

      {/* ── CONTENIDO PRINCIPAL ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Navbar superior */}
        <header className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-6 flex-shrink-0 z-10">
          <div className="flex items-center gap-3">
            {/* Hamburguesa (mobile) */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ICONS.menu} />
              </svg>
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-400 font-medium hidden sm:inline">COTAL</span>
              <span className="text-slate-300 hidden sm:inline">/</span>
              <span className="font-semibold text-slate-800 capitalize">{pageTitle}</span>
            </div>
          </div>

          {/* Right side — perfil rápido */}
          <div className="flex items-center gap-3">
            {/* Indicador de entorno */}
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-2xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse inline-block" />
              Sesión Activa
            </span>

            {/* Campana de Notificaciones */}
            <button
              onClick={() => navigate('/dashboard')}
              className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              title="Ver notificaciones en Dashboard"
            >
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.02 6.02 0 00-4.902-5.903m-2.127-.002A6.002 6.002 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {hasAlerts && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* Avatar + nombre (desktop) */}
            {user && (
              <div className="hidden md:flex items-center gap-2.5">
                <UserAvatar user={user} size="sm" />
                <div className="leading-tight">
                  <p className="text-xs font-semibold text-slate-800">{user.nombre}</p>
                  <RoleBadge role={user.rol} />
                </div>
              </div>
            )}

            {/* Avatar solo (mobile) */}
            {user && (
              <div className="md:hidden">
                <UserAvatar user={user} size="sm" />
              </div>
            )}
          </div>
        </header>

        {/* Área de contenido */}
        <main className="flex-1 overflow-y-auto">
          {location.pathname === '/messages' ? (
            <Outlet />
          ) : (
            <div className="p-4 md:p-6 lg:p-8">
              <div className="max-w-7xl mx-auto animate-fadeIn">
                <Outlet />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
