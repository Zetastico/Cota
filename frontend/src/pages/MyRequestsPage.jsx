import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import serviceRequestService from '../services/serviceRequestService.js';
import conversationService from '../services/conversationService.js';
import RatingStars from '../components/RatingStars.jsx';
import ReviewModal from '../components/ReviewModal.jsx';

/* ── Toda la lógica es idéntica al original. Solo mejoras visuales. ── */

const Icon = ({ d, size = 'w-4 h-4', stroke = 2 }) => (
  <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={stroke} d={d} />
  </svg>
);

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
};

/* Skeleton de tarjeta */
const RequestSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
    <div className="flex justify-between items-start pb-3 border-b border-slate-50">
      <div className="space-y-2">
        <div className="skeleton h-3 w-28 rounded" />
        <div className="skeleton h-4 w-48 rounded" />
      </div>
      <div className="skeleton h-6 w-20 rounded-full" />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <div className="skeleton h-3 w-20 rounded" />
        <div className="skeleton h-3.5 w-32 rounded" />
      </div>
      <div className="space-y-2">
        <div className="skeleton h-3 w-20 rounded" />
        <div className="skeleton h-3.5 w-28 rounded" />
      </div>
    </div>
  </div>
);

/* Badge de estado premium */
const STATUS_CONFIG = {
  ACCEPTED: {
    label: 'Aceptada',
    cls: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  PENDING: {
    label: 'Pendiente',
    cls: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-400',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  REJECTED: {
    label: 'Rechazada',
    cls: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
    icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
};

const PAYMENT_METHODS = {
  CASH: 'Efectivo',
  QR: 'Código QR',
  CARD: 'Tarjeta',
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

/* KPI Card */
const KpiCard = ({ label, value, color }) => {
  const variants = {
    indigo:  'from-indigo-500 to-indigo-600',
    amber:   'from-amber-400 to-amber-500',
    emerald: 'from-emerald-500 to-emerald-600',
    rose:    'from-rose-500 to-rose-600',
  };
  return (
    <div className={`bg-gradient-to-br ${variants[color] || variants.indigo} rounded-2xl p-4 text-white`}>
      <p className="text-2xl font-display font-extrabold leading-none">{value}</p>
      <p className="text-xs text-white/75 font-medium mt-1.5">{label}</p>
    </div>
  );
};

/* RequestCard ─────────────────────────────────────────────────────── */
const RequestCard = ({ req, onRate, onChat }) => (
  <div className="group bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden
    hover:shadow-premium-hover hover:border-indigo-100 hover:-translate-y-0.5 transition-all duration-200">

    {/* Banda lateral de estado */}
    <div className={`flex flex-col md:flex-row`}>
      <div className={`w-full md:w-1.5 md:min-h-full flex-shrink-0 ${
        req.status === 'ACCEPTED' ? 'bg-emerald-400 md:bg-none' :
        req.status === 'REJECTED' ? 'bg-rose-400 md:bg-none' :
        'bg-amber-400 md:bg-none'
      } h-1 md:h-auto md:rounded-l-2xl`} />

      <div className="flex-1 p-5">
        {/* Cabecera */}
        <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-50">
          <div className="min-w-0">
            <span className="text-2xs text-slate-400 font-semibold uppercase tracking-wider block">Servicio solicitado</span>
            <h3 className="font-bold text-slate-800 text-sm mt-0.5 leading-snug truncate">{req.service?.title}</h3>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-right">
              <span className="text-lg font-extrabold font-display text-indigo-600">${req.service?.price?.toFixed(2)}</span>
              <span className="block text-2xs text-slate-400 font-medium mt-0.5">{req.service?.category}</span>
            </div>
            <StatusBadge status={req.status} />
          </div>
        </div>

        {/* Cuerpo */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-4">
          {/* Columna izquierda */}
          <div className="space-y-3">
            {/* Proveedor */}
            <div>
              <span className="text-2xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Proveedor</span>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {req.service?.owner?.nombre?.[0]}{req.service?.owner?.apellido?.[0]}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-700">{req.service?.owner?.nombre} {req.service?.owner?.apellido}</p>
                  <p className="text-2xs text-slate-400">{req.service?.owner?.email}</p>
                </div>
              </div>
            </div>

            {/* Teléfono */}
            <div>
              <span className="text-2xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Teléfono</span>
              <p className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                <Icon d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" size="w-3.5 h-3.5 text-slate-400" />
                {req.contactPhone}
              </p>
            </div>
          </div>

          {/* Columna media */}
          <div className="space-y-3">
            {/* Fecha deseada */}
            <div>
              <span className="text-2xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Fecha deseada</span>
              <p className="text-xs font-semibold text-indigo-600 flex items-center gap-1.5">
                <Icon d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" size="w-3.5 h-3.5" />
                {formatDate(req.desiredDate)}
              </p>
            </div>

            {/* Fecha de envío */}
            <div>
              <span className="text-2xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Enviada el</span>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <Icon d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" size="w-3.5 h-3.5 text-slate-400" />
                {formatDate(req.createdAt)}
              </p>
            </div>
          </div>

          {/* Columna derecha: Método de pago y Calificación */}
          <div className="space-y-3">
            {/* Método de pago */}
            <div>
              <span className="text-2xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Método de pago</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg border border-indigo-100 bg-indigo-50/50 text-indigo-700">
                {PAYMENT_METHODS[req.paymentMethod] || 'Efectivo'}
              </span>
            </div>

              {/* Calificación */}
              {req.status === 'ACCEPTED' && (
                <div>
                  <span className="text-2xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Calificación</span>
                  {req.review ? (
                    <div className="space-y-1">
                      <RatingStars rating={req.review.rating} size={4} />
                      <span className="text-3xs text-emerald-600 font-bold block">Calificado</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => onRate(req)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all active:scale-95"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      Calificar
                    </button>
                  )}
                </div>
              )}

              {/* Botón Chat */}
              {req.status === 'ACCEPTED' && (
                <button
                  onClick={() => onChat(req)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all active:scale-95 mt-1"
                >
                  <Icon d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" size="w-3.5 h-3.5" />
                  Abrir Chat
                </button>
              )}
            </div>
        </div>

        {/* Mensaje */}
        {req.message && (
          <div className="mt-4 pt-4 border-t border-slate-50">
            <span className="text-2xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Tu mensaje</span>
            <p className="text-xs text-slate-600 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 leading-relaxed italic">
              "{req.message}"
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════ */
const MyRequestsPage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [filter, setFilter] = useState('all');

  // Modal de calificar
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  // Lógica sin cambios
  const fetchRequests = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await serviceRequestService.getMyRequests();
      setRequests(response.data || []);
    } catch (err) {
      console.error(err);
      setErrorMsg('No se pudo cargar el historial de tus solicitudes.');
    } finally {
      setLoading(false);
    }
  };

  const handleRateClick = (req) => {
    setSelectedRequest(req);
    setIsReviewOpen(true);
  };

  const handleReviewSuccess = (newReview) => {
    // Actualizar solicitud localmente para mostrar la calificación
    setRequests((prev) =>
      prev.map((r) => (r.id === selectedRequest.id ? { ...r, review: newReview } : r))
    );
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

  const filteredRequests = filter === 'all'
    ? requests
    : requests.filter((r) => r.status === filter.toUpperCase());

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-900 md:text-2xl">Mis Solicitudes</h2>
          <p className="text-xs text-slate-500 mt-1">
            Consulta el estado de todas las solicitudes de servicios que has enviado.
          </p>
        </div>
        {!loading && requests.length > 0 && (
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {[
              { key: 'all', label: 'Todas' },
              { key: 'pending', label: 'Pendientes' },
              { key: 'accepted', label: 'Aceptadas' },
              { key: 'rejected', label: 'Rechazadas' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                  ${filter === key
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Banner de error */}
      {errorMsg && (
        <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex gap-3 text-rose-700 text-xs font-medium animate-fadeIn">
          <Icon d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" size="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Skeleton */}
      {loading ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => <div key={n} className="skeleton h-20 rounded-2xl" />)}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((n) => <RequestSkeleton key={n} />)}
          </div>
        </>
      ) : requests.length === 0 ? (
        /* Estado vacío */
        <div className="bg-white border border-slate-100 rounded-2xl p-14 text-center shadow-premium space-y-4">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-300 rounded-2xl flex items-center justify-center mx-auto border border-indigo-100">
            <Icon d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" size="w-8 h-8" stroke={1.4} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-700">No tienes solicitudes aún</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1 leading-relaxed">
              Cuando solicites un servicio desde "Explorar Servicios", aparecerá aquí con su estado actualizado.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <KpiCard label="Total enviadas" value={stats.total}    color="indigo"  />
            <KpiCard label="Pendientes"     value={stats.pending}  color="amber"   />
            <KpiCard label="Aceptadas"      value={stats.accepted} color="emerald" />
            <KpiCard label="Rechazadas"     value={stats.rejected} color="rose"    />
          </div>

          {/* Lista filtrada */}
          {filteredRequests.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-2xl p-10 text-center">
              <p className="text-sm text-slate-500">No hay solicitudes con este estado.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((req) => (
                <RequestCard key={req.id} req={req} onRate={handleRateClick} onChat={handleChatClick} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal de Calificación */}
      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        request={selectedRequest}
        onSuccess={handleReviewSuccess}
      />
    </div>
  );
};

export default MyRequestsPage;
