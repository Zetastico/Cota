import { useEffect, useState } from 'react';
import serviceRequestService from '../services/serviceRequestService.js';

/**
 * Vista del cliente (USER) para consultar el historial de sus propias solicitudes.
 */
const MyRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

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

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderStatusBadge = (status) => {
    const styles = {
      ACCEPTED: 'bg-emerald-50 text-emerald-700 border-emerald-150',
      PENDING: 'bg-amber-50 text-amber-700 border-amber-150',
      REJECTED: 'bg-rose-50 text-rose-700 border-rose-150',
    };
    const labels = {
      ACCEPTED: 'Aceptada',
      PENDING: 'Pendiente',
      REJECTED: 'Rechazada',
    };
    const icons = {
      ACCEPTED: (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      PENDING: (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      REJECTED: (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    };
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-2xs font-semibold rounded-full border ${styles[status] || styles.PENDING}`}>
        {icons[status]}
        {labels[status] || status}
      </span>
    );
  };

  // Estadísticas rápidas
  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === 'PENDING').length,
    accepted: requests.filter((r) => r.status === 'ACCEPTED').length,
    rejected: requests.filter((r) => r.status === 'REJECTED').length,
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Encabezado */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 md:text-2xl">Mis Solicitudes</h2>
        <p className="text-xs text-slate-500 mt-1">
          Consulta el estado de todas las solicitudes de servicios que has enviado.
        </p>
      </div>

      {/* Banner de error */}
      {errorMsg && (
        <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex gap-3 text-rose-800 text-xs font-medium animate-fadeIn">
          <svg className="w-5 h-5 flex-shrink-0 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Cargando */}
      {loading ? (
        <div className="bg-white border border-slate-150 rounded-2xl p-12 text-center shadow-xs">
          <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400 mt-3 font-medium">Cargando tu historial...</p>
        </div>
      ) : requests.length === 0 ? (
        /* Estado vacío */
        <div className="bg-white border border-slate-150 rounded-2xl p-14 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto border border-indigo-100">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-700">No tienes solicitudes aún</h3>
            <p className="text-2xs text-slate-400 max-w-xs mx-auto mt-1">
              Cuando solicites un servicio desde la sección "Explorar Servicios", aparecerá aquí con su estado.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Tarjetas de resumen */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total', value: stats.total, color: 'text-slate-700', bg: 'bg-slate-50 border-slate-150' },
              { label: 'Pendientes', value: stats.pending, color: 'text-amber-700', bg: 'bg-amber-50 border-amber-100' },
              { label: 'Aceptadas', value: stats.accepted, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-100' },
              { label: 'Rechazadas', value: stats.rejected, color: 'text-rose-700', bg: 'bg-rose-50 border-rose-100' },
            ].map((stat) => (
              <div key={stat.label} className={`${stat.bg} border rounded-xl p-4 text-center shadow-xs`}>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-2xs text-slate-500 font-medium mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Listado de solicitudes */}
          <div className="grid grid-cols-1 gap-5">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-white border border-slate-150 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-start justify-between gap-5 hover:border-slate-300 transition-colors"
              >
                {/* Información de la solicitud */}
                <div className="space-y-4 flex-1">
                  {/* Cabecera */}
                  <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-50 pb-3">
                    <div>
                      <span className="text-3xs text-slate-400 font-semibold uppercase tracking-wider block">
                        Servicio Solicitado
                      </span>
                      <h3 className="font-bold text-slate-800 text-sm mt-0.5">
                        {req.service?.title}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-800 block">
                        ${req.service?.price?.toFixed(2)}
                      </span>
                      <span className="text-3xs text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded border border-slate-200 mt-0.5 inline-block">
                        {req.service?.category}
                      </span>
                    </div>
                  </div>

                  {/* Proveedor */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div>
                        <span className="text-3xs text-slate-400 font-semibold uppercase tracking-wider block">
                          Proveedor (HOST)
                        </span>
                        <p className="text-xs font-semibold text-slate-700 mt-0.5">
                          {req.service?.owner?.nombre} {req.service?.owner?.apellido}
                        </p>
                        <p className="text-2xs text-slate-400">{req.service?.owner?.email}</p>
                      </div>
                      <div>
                        <span className="text-3xs text-slate-400 font-semibold uppercase tracking-wider block">
                          Fecha Deseada
                        </span>
                        <p className="text-xs font-semibold text-indigo-600 mt-0.5">
                          {formatDate(req.desiredDate)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="text-3xs text-slate-400 font-semibold uppercase tracking-wider block">
                          Teléfono de Contacto
                        </span>
                        <p className="text-xs font-medium text-slate-700 mt-0.5">{req.contactPhone}</p>
                      </div>
                      <div>
                        <span className="text-3xs text-slate-400 font-semibold uppercase tracking-wider block">
                          Tu Mensaje
                        </span>
                        <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed italic mt-0.5">
                          "{req.message}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Estado y fecha de envío */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start self-stretch md:border-l md:border-slate-100 md:pl-5 min-w-[130px] gap-3">
                  <div className="text-left md:text-right">
                    <span className="text-3xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                      Estado
                    </span>
                    {renderStatusBadge(req.status)}
                  </div>
                  <div className="text-left md:text-right">
                    <span className="text-3xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                      Enviada el
                    </span>
                    <p className="text-2xs text-slate-500 font-medium">
                      {formatDate(req.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MyRequestsPage;
