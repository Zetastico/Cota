import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import userService from '../services/userService.js';
import statsService from '../services/statsService.js';
import StatCard from '../components/StatCard.jsx';
import ChartCard from '../components/ChartCard.jsx';
import NotificationPanel from '../components/NotificationPanel.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { SkeletonKPI, SkeletonChart, SkeletonRow } from '../components/SkeletonCard.jsx';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

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

/* ── Custom Chart Tooltip ── */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs shadow-xl border border-slate-800">
        <p className="font-bold">{label || payload[0].name}</p>
        <p className="text-2xs text-slate-300 mt-0.5">
          Cantidad: <span className="font-bold text-white">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

/* ── Quick Action Card ── */
const ActionCard = ({ title, desc, href, icon, gradient }) => (
  <Link
    to={href}
    className="group relative bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden
      hover:shadow-premium-hover hover:border-indigo-100 hover:-translate-y-0.5 transition-all duration-200 p-5 flex flex-col gap-3"
  >
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
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-white/5 rounded-full blur-xl" />
      <div className="absolute top-4 right-4 w-20 h-20 bg-white/5 rounded-full" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="relative z-10 max-w-xl">
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-slow animate-pulse" />
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
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  
  // Admin local states
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    // Fetch stats
    (async () => {
      try {
        setLoadingStats(true);
        const res = await statsService.getDashboardStats();
        if (res.success) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Error al obtener estadísticas del dashboard:', err);
      } finally {
        setLoadingStats(false);
      }
    })();

    // Fetch users for admin only
    if (user.rol === 'ADMIN') {
      (async () => {
        try {
          setLoadingUsers(true);
          const res = await userService.getAllUsers();
          const sorted = (res.data || []).sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setUsersList(sorted.slice(0, 5));
        } catch (e) {
          console.error(e);
        } finally {
          setLoadingUsers(false);
        }
      })();
    }
  }, [user]);

  if (!user) return null;
  if (user.rol === 'USER') {
    return <Navigate to="/services/explore" replace />;
  }

  // Visual Palette Colors
  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#6366F1', '#3B82F6', '#EC4899'];

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* ── Welcome Banner ── */}
      <HeroBanner
        user={user}
        subtitle={
          user.rol === 'ADMIN' ? 'Tienes control total del sistema. Gestiona usuarios, modera servicios y supervisa toda la actividad de la plataforma.'
          : user.rol === 'HOST' ? 'Publica tus servicios, gestiona solicitudes y construye tu reputación en la plataforma COTAL.'
          : 'Explora servicios publicados por proveedores verificados, envía solicitudes y lleva el seguimiento de tu historial.'
        }
      />

      {/* ── Notifications Panel ── */}
      <NotificationPanel role={user.rol} stats={stats?.stats} loading={loadingStats} />

      {/* ── KPI Cards Section ── */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Estadísticas Principales</h3>
        {loadingStats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(n => <SkeletonKPI key={n} />)}
          </div>
        ) : (
          <>
            {user.rol === 'ADMIN' && stats && (
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <StatCard
                  label="Total Usuarios"
                  value={stats.stats.totalUsers}
                  color="indigo"
                  sub="Usuarios registrados"
                  icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                />
                <StatCard
                  label="Total Servicios"
                  value={stats.stats.totalServices}
                  color="emerald"
                  sub={`Aprobados: ${stats.stats.approvedServices} | Pendientes: ${stats.stats.pendingServices}`}
                  icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                />
                <StatCard
                  label="Servicios Pendientes"
                  value={stats.stats.pendingServices}
                  color="amber"
                  sub="Requieren moderación"
                  icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}
                />
                <StatCard
                  label="Total Solicitudes"
                  value={stats.stats.totalRequests}
                  color="slate"
                  sub={`Aceptadas: ${stats.stats.acceptedRequests} | Pendientes: ${stats.stats.pendingRequests}`}
                  icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
                />
              </div>
            )}

            {user.rol === 'HOST' && stats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  label="Mis Servicios"
                  value={stats.stats.totalServices}
                  color="emerald"
                  sub={`Aprobados: ${stats.stats.approvedServices}`}
                  icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                />
                <StatCard
                  label="Servicios Pendientes"
                  value={stats.stats.pendingServices}
                  color="amber"
                  sub="En espera de aprobación"
                  icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
                />
                <StatCard
                  label="Solicitudes Recibidas"
                  value={stats.stats.totalRequestsReceived}
                  color="indigo"
                  sub="Interés de clientes"
                  icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                />
                <StatCard
                  label="Pendientes de Respuesta"
                  value={stats.stats.pendingRequestsReceived}
                  color="rose"
                  sub="Requieren tu atención"
                  icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
                />
              </div>
            )}

            {user.rol === 'USER' && stats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  label="Solicitudes Realizadas"
                  value={stats.stats.totalRequests}
                  color="indigo"
                  sub="Total contrataciones enviadas"
                  icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
                />
                <StatCard
                  label="Solicitudes Aceptadas"
                  value={stats.stats.acceptedRequests}
                  color="emerald"
                  sub="Listas para coordinar"
                  icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                <StatCard
                  label="En Espera"
                  value={stats.stats.pendingRequests}
                  color="amber"
                  sub="Esperando respuesta del host"
                  icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                <StatCard
                  label="Servicios Disponibles"
                  value={stats.stats.totalServicesAvailable}
                  color="slate"
                  sub="Servicios aprobados en COTAL"
                  icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Charts Section ── */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Métricas Visuales</h3>
        {loadingStats ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <SkeletonChart />
            <SkeletonChart />
          </div>
        ) : (
          <>
            {user.rol === 'ADMIN' && stats && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Chart 1: Servicios por estado */}
                <ChartCard title="Servicios por Estado" subtitle="Distribución total de la oferta">
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={stats.charts.servicesByStatus} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                      <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
                      <Bar dataKey="value" fill="#4F46E5" radius={[6, 6, 0, 0]}>
                        {stats.charts.servicesByStatus.map((entry, index) => {
                          const statusColors = ['#F59E0B', '#10B981', '#EF4444'];
                          return <Cell key={`cell-${index}`} fill={statusColors[index % statusColors.length]} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                {/* Chart 2: Usuarios por rol */}
                <ChartCard title="Distribución de Usuarios" subtitle="Porcentaje de roles en el sistema">
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={stats.charts.usersByRole}
                        cx="50%"
                        cy="45%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {stats.charts.usersByRole.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        verticalAlign="bottom"
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ fontSize: '10px', color: '#64748B' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>

                {/* Chart 3: Solicitudes por estado */}
                <ChartCard title="Solicitudes por Estado" subtitle="Procesamiento general de solicitudes">
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={stats.charts.requestsByStatus} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                      <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
                      <Bar dataKey="value" fill="#10B981" radius={[6, 6, 0, 0]}>
                        {stats.charts.requestsByStatus.map((entry, index) => {
                          const reqColors = ['#F59E0B', '#10B981', '#EF4444'];
                          return <Cell key={`cell-${index}`} fill={reqColors[index % reqColors.length]} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            )}

            {user.rol === 'HOST' && stats && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Chart 1: Solicitudes recibidas por estado */}
                <ChartCard title="Solicitudes Recibidas" subtitle="Estado de solicitudes dirigidas a ti">
                  {stats.stats.totalRequestsReceived === 0 ? (
                    <EmptyState
                      title="Sin solicitudes recibidas"
                      description="Aún no has recibido solicitudes para tus servicios publicados."
                    />
                  ) : (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={stats.charts.requestsReceivedByStatus} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                        <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                          {stats.charts.requestsReceivedByStatus.map((entry, index) => {
                            const reqColors = ['#F59E0B', '#10B981', '#EF4444'];
                            return <Cell key={`cell-${index}`} fill={reqColors[index % reqColors.length]} />;
                          })}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </ChartCard>

                {/* Chart 2: Servicios publicados por estado */}
                <ChartCard title="Tus Servicios publicados" subtitle="Estado de tus publicaciones de servicio">
                  {stats.stats.totalServices === 0 ? (
                    <EmptyState
                      title="Sin servicios publicados"
                      description="Crea tu primer servicio para empezar a recibir clientes."
                    />
                  ) : (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={stats.charts.servicesByStatus} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                        <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                          {stats.charts.servicesByStatus.map((entry, index) => {
                            const statusColors = ['#F59E0B', '#10B981', '#EF4444'];
                            return <Cell key={`cell-${index}`} fill={statusColors[index % statusColors.length]} />;
                          })}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </ChartCard>
              </div>
            )}

            {user.rol === 'USER' && stats && (
              <div className="grid grid-cols-1 gap-5">
                {/* Chart 1: Solicitudes por estado */}
                <ChartCard title="Estado de Mis Solicitudes" subtitle="Seguimiento de tus contrataciones">
                  {stats.stats.totalRequests === 0 ? (
                    <EmptyState
                      title="Sin solicitudes realizadas"
                      description="Explora la plataforma y envía solicitudes para ver las métricas."
                    />
                  ) : (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={stats.charts.requestsByStatus} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                        <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                          {stats.charts.requestsByStatus.map((entry, index) => {
                            const reqColors = ['#F59E0B', '#10B981', '#EF4444'];
                            return <Cell key={`cell-${index}`} fill={reqColors[index % reqColors.length]} />;
                          })}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </ChartCard>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Quick Access & Extra Info Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Accesos Rápidos */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Accesos Rápidos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 animate-slideUp">
            {user.rol === 'ADMIN' && (
              <>
                <ActionCard
                  title="Gestionar Usuarios"
                  desc="Visualiza, crea, edita o elimina cuentas del sistema."
                  href="/users"
                  gradient="bg-gradient-to-br from-indigo-500 to-indigo-700"
                  icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                />
                <ActionCard
                  title="Moderar Servicios"
                  desc="Revisa y aprueba o rechaza los servicios pendientes de publicación."
                  href="/services/pending"
                  gradient="bg-gradient-to-br from-amber-500 to-amber-600"
                  icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}
                />
              </>
            )}

            {user.rol === 'HOST' && (
              <>
                <ActionCard
                  title="Mis Servicios"
                  desc="Administra tus ofertas de servicio: crea nuevas, edita o elimina."
                  href="/services"
                  gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
                  icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                />
                <ActionCard
                  title="Solicitudes Recibidas"
                  desc="Revisa las solicitudes de clientes interesados en tus servicios."
                  href="/service-requests"
                  gradient="bg-gradient-to-br from-indigo-500 to-indigo-600"
                  icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
                />
                <ActionCard
                  title="Crear Nuevo Servicio"
                  desc="Añade una nueva oferta a la plataforma de inmediato."
                  href="/services/create"
                  gradient="bg-gradient-to-br from-amber-500 to-amber-600"
                  icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}
                />
              </>
            )}

            {user.rol === 'USER' && (
              <>
                <ActionCard
                  title="Explorar Servicios"
                  desc="Busca y filtra servicios aprobados de proveedores verificados."
                  href="/services/explore"
                  gradient="bg-gradient-to-br from-indigo-500 to-indigo-700"
                  icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
                />
                <ActionCard
                  title="Mis Solicitudes"
                  desc="Consulta el estado de todas las solicitudes enviadas a proveedores."
                  href="/my-requests"
                  gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
                  icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
                />
              </>
            )}
          </div>
        </div>

        {/* Panel derecho — Info dinámica o Lista admin */}
        <div className="lg:col-span-3">
          {user.rol === 'ADMIN' ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-premium p-5 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800">Últimos Registros</h3>
                <Link to="/users" className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 transition-colors">
                  Ver todos
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              {loadingUsers ? (
                <div className="space-y-3 flex-1">
                  {[1, 2, 3, 4, 5].map((n) => <SkeletonRow key={n} />)}
                </div>
              ) : usersList.length === 0 ? (
                <div className="flex-1 flex items-center justify-center py-8">
                  <p className="text-xs text-slate-400 italic">No hay usuarios registrados.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50 flex-1">
                  {usersList.map((usr) => (
                    <div key={usr.id} className="flex items-center gap-3 py-2.5 group hover:bg-slate-50/60 -mx-1 px-1 rounded-xl transition-colors">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {usr.nombre[0]}{usr.apellido[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">{usr.nombre} {usr.apellido}</p>
                        <p className="text-2xs text-slate-400 truncate">{usr.email}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <RoleBadgeLarge role={usr.rol} />
                        <p className="text-2xs text-slate-400 mt-1">{formatDate(usr.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-premium p-6 h-full">
              <h3 className="text-sm font-bold text-slate-800 mb-4">
                {user.rol === 'HOST' ? '¿Cómo funciona para el HOST?' : '¿Cómo funciona para el USER?'}
              </h3>
              <ol className="space-y-4">
                {user.rol === 'HOST' ? (
                  [
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
                  ))
                ) : (
                  [
                    { n: '01', title: 'Explora servicios', desc: 'Busca por texto, filtra por categoría y ordena a tu gusto.', color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
                    { n: '02', title: 'Envía una solicitud', desc: 'Contacta al proveedor indicando fecha deseada, mensaje y teléfono.', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
                    { n: '03', title: 'Espera la respuesta', desc: 'El proveedor revisará tu solicitud y la aceptará o rechazará.', color: 'text-amber-600 bg-amber-50 border-amber-100' },
                    { n: '04', title: 'Consulta tu historial', desc: 'En "Mis Solicitudes" puedes ver el estado en tiempo real.', color: 'text-slate-600 bg-slate-50 border-slate-200' },
                  ].map(({ n, title, desc, color }) => (
                    <li key={n} className="flex items-start gap-4">
                      <span className={`flex-shrink-0 w-8 h-8 rounded-xl border text-xs font-bold flex items-center justify-center ${color}`}>{n}</span>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                      </div>
                    </li>
                  ))
                )}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
