import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import serviceRequestService from '../services/serviceRequestService.js';
import conversationService from '../services/conversationService.js';

/* ── Toda la lógica es idéntica al original. Solo mejoras visuales. ── */

const Icon = ({ d, size = 'w-4 h-4', stroke = 2 }) => (
  <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={stroke} d={d} />
  </svg>
);

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

/* Skeleton de tarjeta */
const RequestSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
    <div className="flex justify-between pb-3 border-b border-slate-50">
      <div className="space-y-2">
        <div className="skeleton h-3 w-28 rounded" />
        <div className="skeleton h-4 w-48 rounded" />
      </div>
      <div className="skeleton h-6 w-20 rounded-full" />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <div className="skeleton h-3 w-16 rounded" /><div className="skeleton h-4 w-36 rounded" />
      </div>
      <div className="space-y-2">
        <div className="skeleton h-3 w-16 rounded" /><div className="skeleton h-4 w-28 rounded" />
      </div>
    </div>
    <div className="flex justify-end gap-2 pt-2">
      <div className="skeleton h-8 w-24 rounded-xl" />
      <div className="skeleton h-8 w-24 rounded-xl" />
    </div>
  </div>
);

/* Badge de estado */
const STATUS_CONFIG = {
  ACCEPTED: { label: 'Aceptada', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  PENDING:  { label: 'Pendiente', cls: 'bg-amber-50 text-amber-700 border-amber-200',   dot: 'bg-amber-400 animate-pulse' },
  REJECTED: { label: 'Rechazada', cls: 'bg-rose-50 text-rose-700 border-rose-200',    dot: 'bg-rose-500' },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} flex-shrink-0`} />
      {cfg.label}
    </span>
  );
};

/* Stat pill */
const StatPill = ({ label, value, color }) => {
  const colors = {
    slate:   'bg-slate-100 text-slate-700',
    amber:   'bg-amber-50  text-amber-700  border border-amber-100',
    emerald: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    rose:    'bg-rose-50   text-rose-700   border border-rose-100',
  };
  return (
    <div className={`flex flex-col items-center justify-center rounded-xl px-4 py-3 ${colors[color]}`}>
      <span className="text-2xl font-display font-extrabold leading-none">{value}</span>
      <span className="text-2xs font-medium mt-1 leading-none">{label}</span>
    </div>
  );
};

/* Tarjeta de solicitud recibida (HOST view) */
const RequestCard = ({ req, onAccept, onReject, onChat, actioningId }) => {
  const isActioning = actioningId === req.id;
  const isPending = req.status === 'PENDING';

  return (
    <div className={`group bg-white rounded-2xl border shadow-premium overflow-hidden
      transition-all duration-200
      ${isPending
        ? 'border-amber-200 hover:border-amber-300 hover:shadow-premium-hover hover:-translate-y-0.5'
        : 'border-slate-100 hover:border-slate-200'
      }`}>

      {/* Indicador de estado top */}
      <div className={`h-1 w-full ${
        req.status === 'ACCEPTED' ? 'bg-emerald-400' :
        req.status === 'REJECTED' ? 'bg-rose-400' :
        'bg-amber-400'
      }`} />

      <div className="p-5 space-y-4">
        {/* Cabecera: servicio + precio + badge */}
        <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-50">
          <div className="min-w-0">
            <span className="text-2xs text-slate-400 font-semibold uppercase tracking-wider block">Solicitud para</span>
            <h3 className="font-bold text-slate-800 text-sm mt-0.5 leading-snug">{req.service?.title}</h3>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs font-bold text-indigo-600">${req.service?.price?.toFixed(2)}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-2xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{req.service?.category}</span>
            </div>
          </div>
          <StatusBadge status={req.status} />
        </div>

        {/* Datos del cliente + detalles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Cliente */}
          <div className="space-y-3">
            <div>
              <span className="text-2xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Cliente</span>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {req.user?.nombre?.[0]}{req.user?.apellido?.[0]}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">{req.user?.nombre} {req.user?.apellido}</p>
                  <p className="text-2xs text-slate-400">{req.user?.email}</p>
                </div>
              </div>
            </div>
            <div>
              <span className="text-2xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Teléfono</span>
              <p className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                <Icon d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" size="w-3.5 h-3.5 text-slate-400" />
                {req.contactPhone}
              </p>
            </div>
          </div>

          {/* Fechas y método de pago */}
          <div className="space-y-3">
            <div>
              <span className="text-2xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Fecha deseada</span>
              <p className="text-xs font-semibold text-indigo-600 flex items-center gap-1.5">
                <Icon d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" size="w-3.5 h-3.5" />
                {formatDate(req.desiredDate)}
              </p>
            </div>
            <div>
              <span className="text-2xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Método de pago</span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-bold rounded-lg border border-indigo-100 bg-indigo-50/50 text-indigo-700">
                {req.paymentMethod === 'CARD' ? 'Tarjeta' : req.paymentMethod === 'QR' ? 'Código QR' : 'Efectivo'}
              </span>
            </div>
          </div>
        </div>

        {/* Calificación si la hay */}
        {req.review && (
          <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 space-y-1.5">
            <span className="text-2xs text-slate-400 font-semibold uppercase tracking-wider block">Calificación recibida</span>
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg key={s} className={`w-4 h-4 ${s <= req.review.rating ? 'fill-current' : 'text-slate-300'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <span className="text-xs font-bold text-slate-700">{req.review.rating}/5</span>
            </div>
            {req.review.comment && (
              <p className="text-xs text-slate-500 italic mt-1">"{req.review.comment}"</p>
            )}
          </div>
        )}

        {/* Mensaje del cliente */}
        {req.message && (
          <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
            <span className="text-2xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Mensaje del cliente</span>
            <p className="text-xs text-slate-600 leading-relaxed italic">"{req.message}"</p>
          </div>
        )}

        {/* Botones de acción — solo si PENDING */}
        {isPending && (
          <div className="flex gap-3 pt-1">
            <button
              onClick={() => onReject(req.id, req.service?.title)}
              disabled={actioningId !== null}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5
                border border-slate-200 hover:border-rose-200 hover:bg-rose-50/40
                text-slate-600 hover:text-rose-700
                rounded-xl text-xs font-bold transition-all disabled:opacity-50"
            >
              {isActioning ? (
                <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 border-t-rose-500 animate-spin" />
              ) : (
                <Icon d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" size="w-3.5 h-3.5" />
              )}
              Rechazar
            </button>
            <button
              onClick={() => onAccept(req.id, req.service?.title)}
              disabled={actioningId !== null}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5
                bg-emerald-600 hover:bg-emerald-700 active:scale-95
                text-white rounded-xl text-xs font-bold
                shadow-sm hover:shadow transition-all disabled:opacity-50"
            >
              {isActioning ? (
                <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <Icon d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" size="w-3.5 h-3.5" />
              )}
              Aceptar
            </button>
          </div>
        )}

        {/* Botón Chat — solo si la solicitud fue ACCEPTED */}
        {req.status === 'ACCEPTED' && (
          <div className="pt-1">
            <button
              onClick={() => onChat(req)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5
                bg-emerald-600 hover:bg-emerald-700 active:scale-95
                text-white rounded-xl text-xs font-bold
                shadow-sm hover:shadow transition-all"
            >
              <Icon d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" size="w-3.5 h-3.5" />
              Abrir Chat con Cliente
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════ */
const MyServiceRequestsPage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchRequests();
  }, []);

  // Lógica sin cambios
  const fetchRequests = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await serviceRequestService.getMyServiceRequests();
      setRequests(response.data || []);
    } catch (err) {
      console.error(err);
      setErrorMsg('No se pudo cargar el listado de solicitudes recibidas.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id, title) => {
    setActioningId(id);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await serviceRequestService.acceptRequest(id);
      setSuccessMsg(`La solicitud para el servicio "${title}" fue aceptada.`);
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'ACCEPTED' } : r)));
      setTimeout(() => setSuccessMsg(''), 4500);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'No se pudo aceptar la solicitud.');
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (id, title) => {
    setActioningId(id);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await serviceRequestService.rejectRequest(id);
      setSuccessMsg(`La solicitud para el servicio "${title}" fue rechazada.`);
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'REJECTED' } : r)));
      setTimeout(() => setSuccessMsg(''), 4500);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'No se pudo rechazar la solicitud.');
    } finally {
      setActioningId(null);
    }
  };

  const handleChatClick = async (req) => {
    try {
      const conv = await conversationService.openConversationFromRequest(req.id);
      navigate(`/messages?conversationId=${conv.id}`);
    } catch (err) {
      console.error('Error al abrir chat:', err);
    }
  };

  const stats = {
    total:    requests.length,
    pending:  requests.filter((r) => r.status === 'PENDING').length,
    accepted: requests.filter((r) => r.status === 'ACCEPTED').length,
    rejected: requests.filter((r) => r.status === 'REJECTED').length,
  };

  const filtered = statusFilter === 'all'
    ? requests
    : requests.filter((r) => r.status === statusFilter.toUpperCase());

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-900 md:text-2xl">Solicitudes Recibidas</h2>
          <p className="text-xs text-slate-500 mt-1">
            Gestiona las solicitudes de clientes interesados en tus servicios.
          </p>
        </div>
        {/* Filtros por estado */}
        {!loading && requests.length > 0 && (
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl flex-shrink-0">
            {[
              { key: 'all',      label: 'Todas' },
              { key: 'pending',  label: `Pendientes${stats.pending > 0 ? ` (${stats.pending})` : ''}` },
              { key: 'accepted', label: 'Aceptadas' },
              { key: 'rejected', label: 'Rechazadas' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                  ${statusFilter === key
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                  }
                  ${key === 'pending' && stats.pending > 0 ? 'font-bold' : ''}`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Banners */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex gap-3 text-emerald-800 text-xs font-medium animate-fadeIn">
          <Icon d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" size="w-5 h-5 flex-shrink-0 text-emerald-500" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex gap-3 text-rose-800 text-xs font-medium animate-fadeIn">
          <Icon d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" size="w-5 h-5 flex-shrink-0 text-rose-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => <div key={n} className="skeleton h-20 rounded-xl" />)}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((n) => <RequestSkeleton key={n} />)}
          </div>
        </>
      ) : requests.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl p-14 text-center shadow-premium space-y-4">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-300 rounded-2xl flex items-center justify-center mx-auto border border-emerald-100">
            <Icon d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" size="w-8 h-8" stroke={1.4} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-700">Sin solicitudes todavía</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1 leading-relaxed">
              Cuando un cliente solicite uno de tus servicios aprobados, aparecerá aquí para que puedas gestionarlo.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Stats resumen */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatPill label="Total"      value={stats.total}    color="slate"   />
            <StatPill label="Pendientes" value={stats.pending}  color="amber"   />
            <StatPill label="Aceptadas"  value={stats.accepted} color="emerald" />
            <StatPill label="Rechazadas" value={stats.rejected} color="rose"    />
          </div>

          {/* Alerta de pendientes */}
          {stats.pending > 0 && statusFilter === 'all' && (
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3.5">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
              <p className="text-xs text-amber-800 font-medium">
                Tienes <strong>{stats.pending}</strong> solicitud{stats.pending !== 1 ? 'es' : ''} pendiente{stats.pending !== 1 ? 's' : ''} de respuesta.
              </p>
              <button
                onClick={() => setStatusFilter('pending')}
                className="ml-auto text-xs font-bold text-amber-700 hover:text-amber-900 transition-colors flex-shrink-0"
              >
                Ver →
              </button>
            </div>
          )}

          {/* Lista */}
          {filtered.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-2xl p-10 text-center">
              <p className="text-sm text-slate-500">No hay solicitudes con este filtro.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((req) => (
                <RequestCard
                  key={req.id}
                  req={req}
                  onAccept={handleAccept}
                  onReject={handleReject}
                  onChat={handleChatClick}
                  actioningId={actioningId}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyServiceRequestsPage;
