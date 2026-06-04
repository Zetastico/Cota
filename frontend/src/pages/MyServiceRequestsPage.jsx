import { useEffect, useState } from 'react';
import serviceRequestService from '../services/serviceRequestService.js';

/**
 * Vista del proveedor (HOST) para revisar, aceptar o rechazar solicitudes de sus servicios.
 */
const MyServiceRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

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
      // Actualizar estado en memoria local
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'ACCEPTED' } : r))
      );
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
      // Actualizar estado en memoria local
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'REJECTED' } : r))
      );
      setTimeout(() => setSuccessMsg(''), 4500);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'No se pudo rechazar la solicitud.');
    } finally {
      setActioningId(null);
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
    return (
      <span className={`px-2.5 py-1 text-2xs font-semibold rounded-full border ${styles[status] || styles.PENDING}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Encabezado */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 md:text-2xl">Solicitudes Recibidas</h2>
        <p className="text-xs text-slate-500 mt-1">
          Gestiona las solicitudes de contratación y contacto enviadas por los clientes sobre tus servicios.
        </p>
      </div>

      {/* Banners */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex gap-3 text-emerald-800 text-xs font-medium animate-fadeIn">
          <svg className="w-5 h-5 flex-shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex gap-3 text-rose-800 text-xs font-medium animate-fadeIn">
          <svg className="w-5 h-5 flex-shrink-0 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Listado */}
      {loading ? (
        <div className="bg-white border border-slate-150 rounded-2xl p-12 text-center shadow-xs">
          <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400 mt-3 font-medium">Buscando solicitudes pendientes...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white border border-slate-150 rounded-2xl p-12 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center mx-auto border border-slate-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-slate-700">Sin solicitudes</h3>
          <p className="text-2xs text-slate-400 max-w-xs mx-auto">
            Aún no has recibido solicitudes de contratación para tus servicios publicados.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white border border-slate-150 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-start justify-between gap-5 hover:border-slate-300 transition-colors"
            >
              {/* Información de la solicitud */}
              <div className="space-y-4 flex-1">
                {/* Cabecera de tarjeta */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-50 pb-3">
                  <div>
                    <span className="text-3xs text-slate-400 font-semibold uppercase tracking-wider block">Servicio Solicitado</span>
                    <h3 className="font-bold text-slate-800 text-sm">{req.service?.title}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-800 block">${req.service?.price.toFixed(2)}</span>
                    <span className="text-3xs text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded border border-slate-200 mt-0.5 inline-block">
                      {req.service?.category}
                    </span>
                  </div>
                </div>

                {/* Contenido principal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div>
                      <span className="text-3xs text-slate-400 font-semibold uppercase tracking-wider block">Cliente</span>
                      <p className="text-xs font-semibold text-slate-700">
                        {req.user?.nombre} {req.user?.apellido}
                      </p>
                      <p className="text-2xs text-slate-400">{req.user?.email}</p>
                    </div>
                    <div>
                      <span className="text-3xs text-slate-400 font-semibold uppercase tracking-wider block">Teléfono de Contacto</span>
                      <p className="text-xs font-medium text-slate-700">{req.contactPhone}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-3xs text-slate-400 font-semibold uppercase tracking-wider block">Fecha Deseada de Ejecución</span>
                      <p className="text-xs font-semibold text-indigo-600">{formatDate(req.desiredDate)}</p>
                    </div>
                    <div>
                      <span className="text-3xs text-slate-400 font-semibold uppercase tracking-wider block">Mensaje</span>
                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed italic">
                        "{req.message}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Estado y Acciones */}
              <div className="flex flex-col items-end justify-between self-stretch md:border-l md:border-slate-100 md:pl-5 min-w-[120px] gap-4">
                <div>
                  <span className="text-3xs text-slate-400 font-semibold uppercase tracking-wider block text-right mb-1">Estado</span>
                  {renderStatusBadge(req.status)}
                </div>

                {req.status === 'PENDING' && (
                  <div className="flex flex-row md:flex-col gap-2 w-full mt-auto">
                    <button
                      onClick={() => handleReject(req.id, req.service?.title)}
                      disabled={actioningId !== null}
                      className="flex-1 px-3 py-2 border border-slate-200 hover:border-rose-200 hover:bg-rose-50/20 text-slate-600 hover:text-rose-600 rounded-xl text-3xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      {actioningId === req.id ? '...' : 'Rechazar'}
                    </button>
                    <button
                      onClick={() => handleAccept(req.id, req.service?.title)}
                      disabled={actioningId !== null}
                      className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-3xs font-bold shadow-xs hover:shadow transition-all flex items-center justify-center gap-1.5"
                    >
                      {actioningId === req.id ? '...' : 'Aceptar'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyServiceRequestsPage;
