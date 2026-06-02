import { useEffect, useState } from 'react';
import serviceService from '../services/serviceService.js';

/**
 * Vista de administración para moderar y auditar servicios pendientes de aprobación (ADMIN)
 */
const PendingServicesPage = () => {
  const [pendingServices, setPendingServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await serviceService.getPendingServices();
      setPendingServices(response.data || []);
    } catch (err) {
      console.error(err);
      setErrorMsg('No se pudo cargar la lista de servicios pendientes.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, title) => {
    setActioningId(id);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await serviceService.approveService(id);
      setSuccessMsg(`El servicio "${title}" ha sido aprobado y ya es visible en la plataforma pública.`);
      setPendingServices((prev) => prev.filter((s) => s.id !== id));
      setTimeout(() => setSuccessMsg(''), 4500);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'No se pudo aprobar el servicio.');
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (id, title) => {
    setActioningId(id);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await serviceService.rejectService(id);
      setSuccessMsg(`El servicio "${title}" ha sido rechazado correctamente.`);
      setPendingServices((prev) => prev.filter((s) => s.id !== id));
      setTimeout(() => setSuccessMsg(''), 4500);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'No se pudo rechazar el servicio.');
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 md:text-2xl">Moderación de Servicios</h2>
        <p className="text-xs text-slate-500 mt-1">
          Audita y autoriza las nuevas ofertas y modificaciones enviadas por los hosts locales de la comunidad.
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

      {/* Contenido principal */}
      {loading ? (
        <div className="bg-white border border-slate-150 rounded-2xl p-12 text-center shadow-xs">
          <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400 mt-3 font-medium">Buscando servicios pendientes...</p>
        </div>
      ) : pendingServices.length === 0 ? (
        <div className="bg-white border border-slate-150 rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center mx-auto border border-slate-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-slate-700">¡Bandeja vacía!</h3>
          <p className="text-2xs text-slate-400 max-w-xs mx-auto">
            No existen servicios pendientes de revisión en este momento. Todos los cambios han sido auditados.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {pendingServices.map((service) => (
            <div
              key={service.id}
              className="bg-white border border-slate-150 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-slate-300 transition-colors"
            >
              {/* Info del servicio */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-amber-50 text-amber-700 border border-amber-100 text-2xs font-semibold px-2 py-0.5 rounded">
                    Pendiente
                  </span>
                  <span className="bg-slate-100 text-slate-700 border border-slate-200 text-2xs font-semibold px-2 py-0.5 rounded">
                    {service.category}
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    ${service.price.toFixed(2)}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{service.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Info del proveedor */}
                {service.owner && (
                  <div className="flex items-center gap-2 pt-2 text-2xs text-slate-400 font-medium">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>
                      Proveedor: <span className="font-semibold text-slate-600">{service.owner.nombre} {service.owner.apellido}</span> ({service.owner.email})
                    </span>
                  </div>
                )}
              </div>

              {/* Botones de acción */}
              <div className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                <button
                  onClick={() => handleReject(service.id, service.title)}
                  disabled={actioningId !== null}
                  className="flex-1 md:flex-initial px-4 py-2 border border-slate-200 hover:border-rose-200 hover:bg-rose-50/20 text-slate-600 hover:text-rose-600 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2"
                >
                  {actioningId === service.id ? 'Cargando...' : 'Rechazar'}
                </button>
                <button
                  onClick={() => handleApprove(service.id, service.title)}
                  disabled={actioningId !== null}
                  className="flex-1 md:flex-initial px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  {actioningId === service.id ? 'Cargando...' : 'Aprobar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingServicesPage;
