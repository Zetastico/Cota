import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import userService from '../services/userService.js';

/* ─────────────────────────────────────────────────────────────────────────
   DashboardPage — Vista principal dinámica por rol
   Solo visual. Cero cambios en lógica, servicios o autenticación.
───────────────────────────────────────────────────────────────────────── */

/* ── Helpers ── */
const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });

const RoleBadgeLarge = ({ role }) => {
  const v = {
    ADMIN: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    HOST:  'bg-emerald-100 text-emerald-700 border-emerald-200',
    USER:  'bg-slate-100 text-slate-600 border-slate-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${v[role] || v.USER}`}>
      {role}
    </span>
  );
};

/* ── Skeleton loader ── */
const Skeleton = ({ className = '' }) => (
  <div className={`skeleton ${className}`} />
);

/* ── Stat card ── */
const StatCard = ({ label, value, icon, color, loading, sub }) => {
  const colors = {
    indigo:  { bg: 'bg-indigo-50',  icon: 'text-indigo-600',  border: 'border-indigo-100' },
    emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'border-emerald-100' },
    amber:   { bg: 'bg-amber-50',   icon: 'text-amber-600',   border: 'border-amber-100' },
    slate:   { bg: 'bg-slate-100',  icon: 'text-slate-600',   border: 'border-slate-200' },
  };
  const c = colors[color] || colors.indigo;
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-premium p-5 flex flex-col gap-4
      hover:shadow-premium-hover hover:border-slate-200 hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-2xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
          <div className="mt-2 text-3xl font-extrabold font-display text-slate-900">
            {loading ? <Skeleton className="h-9 w-16 rounded-lg" /> : value}
          </div>
        </div>
        <div className={`p-2.5 rounded-xl ${c.bg} ${c.icon} border ${c.border}`}>
          {icon}
        </div>
      </div>
      {sub && (
        <p className="text-2xs text-slate-400 font-medium">
          {loading ? <Skeleton className="h-3 w-28 rounded" /> : sub}
        </p>
      )}
    </div>
  );
};

/* ── Quick Action Card ── */
const ActionCard = ({ title, desc, href, icon, gradient }) => (
  <Link
    to={href}
    className="group relative bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden
      hover:shadow-premium-hover hover:border-indigo-100 hover:-translate-y-0.5 transition-all duration-200 p-5 flex flex-col gap-3"
  >
    {/* Top accent line */}
    <div className={`absolute top-0 inset-x-0 h-1 ${gradient} rounded-t-2xl`} />

    <div className={`w-10 h-10 rounded-xl ${gradient} bg-opacity-10 flex items-center justify-center text-white shadow-sm`}>
      {icon}
    </div>
    <div>
      <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">
        {title}
      </h4>
      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</p>
    </div>
    <div className="flex items-center gap-1 text-xs font-semibold text-indigo-600 mt-auto">
      Ir ahora
      <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </Link>
);

/* ── Hero Banner ── */
const HeroBanner = ({ user, subtitle }) => {
  const roleGradient = {
    ADMIN: 'from-indigo-600 via-indigo-700 to-[#3730a3]',
    HOST:  'from-emerald-600 via-emerald-700 to-[#065f46]',
    USER:  'from-indigo-500 via-indigo-600 to-indigo-700',
  };
  const grad = roleGradient[user?.rol] || roleGradient.USER;
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${grad} text-white p-7 md:p-9`}>
      {/* Decoraciones */}
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-white/5 rounded-full blur-xl" />
      <div className="absolute top-4 right-4 w-20 h-20 bg-white/5 rounded-full" />
      {/* Grid pattern decorativo */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 max-w-xl">
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-slow" />
          <span className="text-2xs font-bold uppercase tracking-widest text-white/90">
            {user?.rol === 'ADMIN' ? 'Consola de Administración'
              : user?.rol === 'HOST' ? 'Panel de Proveedor'
              : 'Panel de Usuario'}
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-extrabold leading-tight">
          ¡Hola, {user?.nombre}! 👋
        </h2>
        <p className="mt-2 text-sm text-white/75 leading-relaxed">{subtitle}</p>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   VISTAS POR ROL
═══════════════════════════════════════════════════════════════════ */

/* ── ADMIN VIEW ── */
const AdminDashboard = ({ user }) => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await userService.getAllUsers();
        setTotalUsers(res.count || res.data?.length || 0);
        const sorted = (res.data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setUsersList(sorted.slice(0, 5));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Hero */}
      <HeroBanner
        user={user}
        subtitle="Tienes control total del sistema. Gestiona usuarios, modera servicios y supervisa toda la actividad de la plataforma."
      />

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Usuarios Registrados"
          value={totalUsers}
          loading={loading}
          color="indigo"
          sub="Total en el sistema"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        <StatCard
          label="Tu Credencial"
          value={`${user?.nombre} ${user?.apellido}`}
          loading={false}
          color="slate"
          sub={user?.email}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
        />
        <StatCard
          label="Nivel de Acceso"
          value="ADMIN"
          loading={false}
          color="indigo"
          sub="Privilegios de sistema completos"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          }
        />
      </div>

      {/* Quick actions + recent users */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Accesos rápidos */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          <ActionCard
            title="Gestionar Usuarios"
            desc="Visualiza, crea, edita o elimina cuentas del sistema."
            href="/users"
            gradient="bg-gradient-to-br from-indigo-500 to-indigo-700"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
          />
          <ActionCard
            title="Moderar Servicios"
            desc="Revisa los servicios pendientes de aprobación."
            href="/services/pending"
            gradient="bg-gradient-to-br from-amber-500 to-amber-600"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}
          />
        </div>

        {/* Últimos registros */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-premium p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">Últimos Registros</h3>
            <Link to="/users" className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 transition-colors">
              Ver todos
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="flex items-center gap-3 py-2">
                  <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-32 rounded" />
                    <Skeleton className="h-2.5 w-24 rounded" />
                  </div>
                  <Skeleton className="h-5 w-14 rounded-full" />
                </div>
              ))}
            </div>
          ) : usersList.length === 0 ? (
            <p className="text-xs text-slate-400 italic text-center py-8">No hay usuarios todavía.</p>
          ) : (
            <div className="divide-y divide-slate-50">
              {usersList.map((usr) => (
                <div key={usr.id} className="flex items-center gap-3 py-2.5 group hover:bg-slate-50/60 -mx-1 px-1 rounded-xl transition-colors">
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {usr.nombre[0]}{usr.apellido[0]}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{usr.nombre} {usr.apellido}</p>
                    <p className="text-2xs text-slate-400 truncate">{usr.email}</p>
                  </div>
                  {/* Meta */}
                  <div className="text-right flex-shrink-0">
                    <RoleBadgeLarge role={usr.rol} />
                    <p className="text-2xs text-slate-400 mt-1">{formatDate(usr.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Flujo de roles */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-premium p-6">
        <h3 className="text-sm font-bold text-slate-800 mb-4">Flujo de Roles de COTAL</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              role: 'USER',
              color: 'slate',
              desc: 'Rol para el cliente. Puede explorar servicios aprobados, enviar solicitudes y hacer seguimiento de su historial.',
              dot: 'bg-slate-400',
            },
            {
              role: 'HOST',
              color: 'emerald',
              desc: 'Rol para el proveedor. Publica servicios, los gestiona y acepta o rechaza solicitudes de los clientes.',
              dot: 'bg-emerald-500',
            },
            {
              role: 'ADMIN',
              color: 'indigo',
              desc: 'Rol de sistema. Gestión completa de usuarios, moderación de servicios y supervisión global.',
              dot: 'bg-indigo-600',
            },
          ].map(({ role, color, desc, dot }) => (
            <div key={role} className={`p-4 rounded-xl border ${
              color === 'indigo' ? 'bg-indigo-50/50 border-indigo-100' :
              color === 'emerald' ? 'bg-emerald-50/50 border-emerald-100' :
              'bg-slate-50 border-slate-100'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2 h-2 rounded-full ${dot} flex-shrink-0`} />
                <RoleBadgeLarge role={role} />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── HOST VIEW ── */
const HostDashboard = ({ user }) => (
  <div className="space-y-6 animate-fadeIn">
    <HeroBanner
      user={user}
      subtitle="Publica tus servicios, gestiona solicitudes y construye tu reputación en la plataforma COTAL."
    />

    {/* Credential card */}
    <div className="bg-white rounded-2xl border border-slate-100 shadow-premium p-5 flex flex-col sm:flex-row items-center sm:items-start gap-5">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-glow-emerald flex-shrink-0">
        {user?.nombre?.[0]}{user?.apellido?.[0]}
      </div>
      <div className="flex-1 text-center sm:text-left">
        <p className="text-base font-bold text-slate-900">{user?.nombre} {user?.apellido}</p>
        <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
        <div className="mt-2">
          <RoleBadgeLarge role={user?.rol} />
        </div>
      </div>
      <div className="flex-shrink-0 text-center sm:text-right">
        <p className="text-2xs text-slate-400 font-semibold uppercase tracking-wide">Perfil</p>
        <p className="text-xs font-semibold text-emerald-700 mt-1">Proveedor Activo</p>
      </div>
    </div>

    {/* Acciones rápidas */}
    <div>
      <h3 className="text-sm font-bold text-slate-700 mb-3">Acciones Rápidas</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ActionCard
          title="Mis Servicios"
          desc="Administra tus ofertas de servicio: crea nuevas, edita o elimina las existentes."
          href="/services"
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
        />
        <ActionCard
          title="Solicitudes Recibidas"
          desc="Revisa las solicitudes de clientes interesados en tus servicios. Acepta o rechaza."
          href="/service-requests"
          gradient="bg-gradient-to-br from-indigo-500 to-indigo-600"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}
        />
      </div>
    </div>

    {/* Info del flujo */}
    <div className="bg-white rounded-2xl border border-slate-100 shadow-premium p-6">
      <h3 className="text-sm font-bold text-slate-800 mb-4">¿Cómo funciona para el HOST?</h3>
      <ol className="space-y-4">
        {[
          { n: '01', title: 'Publica tu servicio', desc: 'Crea una oferta con título, descripción, precio y categoría.', color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
          { n: '02', title: 'Espera la aprobación', desc: 'Un administrador revisará y aprobará tu servicio antes de publicarlo.', color: 'text-amber-600 bg-amber-50 border-amber-100' },
          { n: '03', title: 'Recibe solicitudes', desc: 'Clientes interesados te enviarán solicitudes con fecha y mensaje.', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
          { n: '04', title: 'Acepta o rechaza', desc: 'Tú decides qué solicitudes aceptar según tu disponibilidad.', color: 'text-slate-600 bg-slate-50 border-slate-200' },
        ].map(({ n, title, desc, color }) => (
          <li key={n} className="flex items-start gap-4">
            <span className={`flex-shrink-0 w-8 h-8 rounded-xl border text-xs font-bold flex items-center justify-center ${color}`}>{n}</span>
            <div>
              <p className="text-xs font-bold text-slate-800">{title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  </div>
);

/* ── USER VIEW ── */
const UserDashboard = ({ user }) => (
  <div className="space-y-6 animate-fadeIn">
    <HeroBanner
      user={user}
      subtitle="Explora servicios publicados por proveedores verificados, envía solicitudes y lleva el seguimiento de tu historial."
    />

    {/* Credential card */}
    <div className="bg-white rounded-2xl border border-slate-100 shadow-premium p-5 flex flex-col sm:flex-row items-center sm:items-start gap-5">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-400 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-glow-indigo flex-shrink-0">
        {user?.nombre?.[0]}{user?.apellido?.[0]}
      </div>
      <div className="flex-1 text-center sm:text-left">
        <p className="text-base font-bold text-slate-900">{user?.nombre} {user?.apellido}</p>
        <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
        <div className="mt-2">
          <RoleBadgeLarge role={user?.rol} />
        </div>
      </div>
    </div>

    {/* Acciones rápidas */}
    <div>
      <h3 className="text-sm font-bold text-slate-700 mb-3">Acciones Rápidas</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ActionCard
          title="Explorar Servicios"
          desc="Busca y filtra servicios aprobados de proveedores verificados de la comunidad."
          href="/services/explore"
          gradient="bg-gradient-to-br from-indigo-500 to-indigo-700"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
        />
        <ActionCard
          title="Mis Solicitudes"
          desc="Consulta el estado de todas las solicitudes que has enviado a los proveedores."
          href="/my-requests"
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
        />
      </div>
    </div>

    {/* Cómo funciona */}
    <div className="bg-white rounded-2xl border border-slate-100 shadow-premium p-6">
      <h3 className="text-sm font-bold text-slate-800 mb-4">¿Cómo funciona para ti?</h3>
      <ol className="space-y-4">
        {[
          { n: '01', title: 'Explora servicios', desc: 'Busca por texto, filtra por categoría y ordena los resultados a tu gusto.', color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
          { n: '02', title: 'Envía una solicitud', desc: 'Contacta al proveedor indicando fecha deseada, mensaje y teléfono.', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
          { n: '03', title: 'Espera la respuesta', desc: 'El proveedor revisará tu solicitud y la aceptará o rechazará.', color: 'text-amber-600 bg-amber-50 border-amber-100' },
          { n: '04', title: 'Consulta tu historial', desc: 'En "Mis Solicitudes" puedes ver el estado en tiempo real de todas tus gestiones.', color: 'text-slate-600 bg-slate-50 border-slate-200' },
        ].map(({ n, title, desc, color }) => (
          <li key={n} className="flex items-start gap-4">
            <span className={`flex-shrink-0 w-8 h-8 rounded-xl border text-xs font-bold flex items-center justify-center ${color}`}>{n}</span>
            <div>
              <p className="text-xs font-bold text-slate-800">{title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════════════════ */
const DashboardPage = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <>
      {user.rol === 'ADMIN' && <AdminDashboard user={user} />}
      {user.rol === 'HOST'  && <HostDashboard  user={user} />}
      {user.rol === 'USER'  && <UserDashboard  user={user} />}
    </>
  );
};

export default DashboardPage;
