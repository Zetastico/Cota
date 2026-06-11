import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth.js';
import statsService from '../services/statsService.js';
import StatCard from '../components/StatCard.jsx';
import ChartCard from '../components/ChartCard.jsx';
import NotificationPanel from '../components/NotificationPanel.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { SkeletonKPI, SkeletonChart } from '../components/SkeletonCard.jsx';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';

/* ── Custom Chart Tooltip ── */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs shadow-xl border border-slate-800">
        <p className="font-bold">{label}</p>
        <p className="text-2xs text-slate-300 mt-0.5">
          Cantidad: <span className="font-bold text-white">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

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

const UserOverviewPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await statsService.getDashboardStats();
        if (res.success) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Error al obtener estadísticas de usuario:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* ── Banner de Bienvenida ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 text-white p-7 md:p-9 shadow-premium">
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
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-2xs font-bold uppercase tracking-widest text-white/90">Mi Actividad en COTAL</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-extrabold leading-tight">
            Resumen de tu cuenta
          </h2>
          <p className="mt-2 text-sm text-white/75 leading-relaxed">
            Monitorea el progreso de tus solicitudes, revisa las notificaciones importantes y accede rápidamente a los servicios.
          </p>
        </div>
      </div>

      {/* ── Panel de Notificaciones ── */}
      <NotificationPanel role="USER" stats={stats?.stats} loading={loading} />

      {/* ── Tarjetas KPI ── */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Tus Indicadores</h3>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(n => <SkeletonKPI key={n} />)}
          </div>
        ) : (
          stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Solicitudes Realizadas"
                value={stats.stats.totalRequests}
                color="indigo"
                sub="Contrataciones totales"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
              />
              <StatCard
                label="Aceptadas"
                value={stats.stats.acceptedRequests}
                color="emerald"
                sub="Listas para coordinar"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              />
              <StatCard
                label="Pendientes"
                value={stats.stats.pendingRequests}
                color="amber"
                sub="En espera de respuesta"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              />
              <StatCard
                label="Rechazadas"
                value={stats.stats.rejectedRequests}
                color="rose"
                sub="No pudieron procesarse"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              />
            </div>
          )
        )}
      </div>

      {/* ── Gráficos e Historial ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Gráfico */}
        <div className="lg:col-span-8">
          {loading ? (
            <SkeletonChart />
          ) : (
            stats && (
              <ChartCard title="Estado de Solicitudes" subtitle="Detalle visual de tu actividad">
                {stats.stats.totalRequests === 0 ? (
                  <EmptyState
                    title="Aún no has hecho solicitudes"
                    description="Visita el catálogo de servicios para contactar a tu primer proveedor."
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
                          const colors = ['#F59E0B', '#10B981', '#EF4444'];
                          return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </ChartCard>
            )
          )}
        </div>

        {/* Accesos Rápidos */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Enlaces Útiles</h3>
          <ActionCard
            title="Explorar Catálogo"
            desc="Busca profesionales y envía solicitudes en tu comunidad local."
            href="/services/explore"
            gradient="bg-gradient-to-br from-indigo-500 to-indigo-700"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
          />
          <ActionCard
            title="Mis Solicitudes"
            desc="Revisa el estado detallado de tus contactos con hosts."
            href="/my-requests"
            gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
          />
        </div>
      </div>
    </div>
  );
};

export default UserOverviewPage;
