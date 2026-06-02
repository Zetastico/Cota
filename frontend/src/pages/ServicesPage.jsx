import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import serviceService from '../services/serviceService.js';

/**
 * Página del listado de servicios para el HOST (Mis Servicios)
 * Permite listar, editar, eliminar y redirigir al formulario de creación.
 */
const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Estados para Modal de Confirmación de Borrado
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await serviceService.getMyServices();
      setServices(response.data || []);
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || 'No se pudo obtener la lista de servicios.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Abrir diálogo de borrado
  const confirmDelete = (service) => {
    setServiceToDelete(service);
    setDeleteModalOpen(true);
  };

  // Ejecutar eliminación
  const handleDelete = async () => {
    if (!serviceToDelete) return;
    setDeleting(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await serviceService.deleteService(serviceToDelete.id);
      setSuccessMsg(`Servicio "${serviceToDelete.title}" eliminado con éxito.`);
      
      // Actualizar la lista en memoria
      setServices((prev) => prev.filter((s) => s.id !== serviceToDelete.id));
      
      // Cerrar modal
      setDeleteModalOpen(false);
      setServiceToDelete(null);

      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'No se pudo eliminar el servicio.');
      setDeleteModalOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  // Filtrado reactivo en base al buscador
  const filteredServices = services.filter((s) => {
    const term = searchQuery.toLowerCase();
    return (
      s.title.toLowerCase().includes(term) ||
      s.category.toLowerCase().includes(term) ||
      s.description.toLowerCase().includes(term) ||
      s.status.toLowerCase().includes(term)
    );
  });

  const renderStatusBadge = (status) => {
    const styles = {
      APPROVED: 'bg-emerald-50 text-emerald-700 border-emerald-150',
      PENDING: 'bg-amber-50 text-amber-700 border-amber-150',
      REJECTED: 'bg-rose-50 text-rose-700 border-rose-150',
    };
    const labels = {
      APPROVED: 'Aprobado',
      PENDING: 'Pendiente',
      REJECTED: 'Rechazado',
    };
    return (
      <span className={`px-2.5 py-1 text-2xs font-semibold rounded-full border ${styles[status] || styles.PENDING}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 md:text-2xl">Mis Servicios</h2>
          <p className="text-xs text-slate-500 mt-1">
            Administra tus ofertas de servicios, edita campos y sigue su estado de aprobación.
          </p>
        </div>
        <Link
          to="/services/create"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Crear Servicio
        </Link>
      </div>

      {/* Banners de Notificaciones */}
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

      {/* Buscador */}
      <div className="bg-white border border-slate-150 rounded-2xl p-4 flex items-center gap-3">
        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Buscar servicios por título, categoría..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent border-0 p-0 text-slate-700 placeholder-slate-400 focus:ring-0 text-xs"
        />
      </div>

      {/* Tabla o Vista Vacía */}
      {loading ? (
        <div className="bg-white border border-slate-150 rounded-2xl p-12 text-center">
          <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400 mt-3 font-medium">Cargando tus servicios...</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="bg-white border border-slate-150 rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center mx-auto border border-slate-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-slate-700">No se encontraron servicios</h3>
          <p className="text-2xs text-slate-400 max-w-xs mx-auto">
            {searchQuery
              ? 'Intenta cambiar las palabras claves del buscador.'
              : 'Empieza a publicar tus servicios locales para llegar a miles de clientes locales.'}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-150 text-slate-400 text-2xs uppercase tracking-wider font-semibold">
                  <th className="py-4 px-6">Servicio</th>
                  <th className="py-4 px-6">Categoría</th>
                  <th className="py-4 px-6 text-right">Precio</th>
                  <th className="py-4 px-6 text-center">Estado</th>
                  <th className="py-4 px-6 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredServices.map((service) => (
                  <tr key={service.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-800">{service.title}</div>
                      <div className="text-2xs text-slate-400 max-w-xs truncate mt-0.5">{service.description}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-2xs border border-slate-200">
                        {service.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-semibold text-slate-800">
                      ${Number(service.price).toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {renderStatusBadge(service.status)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/services/${service.id}/edit`}
                          state={{ service }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all"
                          title="Editar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => confirmDelete(service)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all"
                          title="Eliminar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN DE BORRADO */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setDeleteModalOpen(false)}></div>
          <div className="bg-white border border-slate-150 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl relative z-10 animate-scaleUp p-6 space-y-4">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center border border-rose-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">¿Eliminar este servicio?</h3>
              <p className="text-2xs text-slate-400 mt-1">
                ¿Está seguro de que desea eliminar permanentemente el servicio "{serviceToDelete?.title}"? Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteModalOpen(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2"
              >
                {deleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
