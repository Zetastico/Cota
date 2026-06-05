import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import serviceService from '../services/serviceService.js';

/* ── Toda la lógica es idéntica al original. Solo mejoras visuales. ── */

const Icon = ({ d, size = 'w-4 h-4', stroke = 2 }) => (
  <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={stroke} d={d} />
  </svg>
);

/* Skeleton de fila */
const RowSkeleton = () => (
  <tr className="border-b border-slate-50">
    <td className="py-4 px-5">
      <div className="space-y-1.5">
        <div className="skeleton h-4 w-36 rounded" />
        <div className="skeleton h-3 w-52 rounded" />
      </div>
    </td>
    <td className="py-4 px-5"><div className="skeleton h-5 w-20 rounded-full" /></td>
    <td className="py-4 px-5 text-right"><div className="skeleton h-4 w-14 rounded ml-auto" /></td>
    <td className="py-4 px-5 text-center"><div className="skeleton h-6 w-20 rounded-full mx-auto" /></td>
    <td className="py-4 px-5"><div className="skeleton h-7 w-16 rounded-lg mx-auto" /></td>
  </tr>
);

/* Badge de estado */
const STATUS_CONFIG = {
  APPROVED: { label: 'Aprobado', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  PENDING:  { label: 'Pendiente', cls: 'bg-amber-50  text-amber-700  border-amber-200',   dot: 'bg-amber-400 animate-pulse' },
  REJECTED: { label: 'Rechazado', cls: 'bg-rose-50   text-rose-700   border-rose-200',    dot: 'bg-rose-500' },
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

/* Badge de categoría */
const categoryColors = {
  Educación:   'bg-blue-50   text-blue-700   border-blue-100',
  Tecnología:  'bg-violet-50 text-violet-700 border-violet-100',
  Música:      'bg-pink-50   text-pink-700   border-pink-100',
  Limpieza:    'bg-cyan-50   text-cyan-700   border-cyan-100',
  Salud:       'bg-emerald-50 text-emerald-700 border-emerald-100',
  Hogar:       'bg-amber-50  text-amber-700  border-amber-100',
};

const CategoryBadge = ({ cat }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-2xs font-bold border ${categoryColors[cat] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
    {cat}
  </span>
);

/* ═══════════════════════════════════════════════════════════════════ */
const ServicesPage = () => {
  const [services, setServices]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [errorMsg, setErrorMsg]         = useState('');
  const [successMsg, setSuccessMsg]     = useState('');
  const [searchQuery, setSearchQuery]   = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [deleting, setDeleting]         = useState(false);
  const [viewMode, setViewMode]         = useState('table'); // 'table' | 'grid'

  useEffect(() => { fetchServices(); }, []);

  // Lógica sin cambios
  const fetchServices = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await serviceService.getMyServices();
      setServices(response.data || []);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'No se pudo obtener la lista de servicios.');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (service) => { setServiceToDelete(service); setDeleteModalOpen(true); };

  const handleDelete = async () => {
    if (!serviceToDelete) return;
    setDeleting(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await serviceService.deleteService(serviceToDelete.id);
      setSuccessMsg(`Servicio "${serviceToDelete.title}" eliminado con éxito.`);
      setServices((prev) => prev.filter((s) => s.id !== serviceToDelete.id));
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

  const filteredServices = services.filter((s) => {
    const term = searchQuery.toLowerCase();
    return (
      s.title.toLowerCase().includes(term) ||
      s.category.toLowerCase().includes(term) ||
      s.description.toLowerCase().includes(term) ||
      s.status.toLowerCase().includes(term)
    );
  });

  // Stats rápidas
  const stats = {
    total:    services.length,
    approved: services.filter((s) => s.status === 'APPROVED').length,
    pending:  services.filter((s) => s.status === 'PENDING').length,
    rejected: services.filter((s) => s.status === 'REJECTED').length,
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-900 md:text-2xl">Mis Servicios</h2>
          <p className="text-xs text-slate-500 mt-1">
            Administra tus ofertas, edita campos y sigue su estado de aprobación.
          </p>
        </div>
        <Link
          to="/services/create"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5
            bg-indigo-600 hover:bg-indigo-700 active:scale-95
            text-white rounded-xl text-sm font-semibold shadow-sm hover:shadow transition-all"
        >
          <Icon d="M12 4v16m8-8H4" size="w-4 h-4" stroke={2.5} />
          Crear Servicio
        </Link>
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

      {/* Stats pills */}
      {!loading && services.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total', value: stats.total,    cls: 'bg-slate-50 border-slate-100 text-slate-700' },
            { label: 'Aprobados', value: stats.approved, cls: 'bg-emerald-50 border-emerald-100 text-emerald-700' },
            { label: 'Pendientes', value: stats.pending,  cls: 'bg-amber-50  border-amber-100  text-amber-700' },
            { label: 'Rechazados', value: stats.rejected, cls: 'bg-rose-50   border-rose-100   text-rose-700' },
          ].map(({ label, value, cls }) => (
            <div key={label} className={`border rounded-xl px-4 py-3 flex flex-col items-center ${cls}`}>
              <span className="text-2xl font-display font-extrabold leading-none">{value}</span>
              <span className="text-2xs font-medium mt-1">{label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Toolbar: búsqueda + toggle de vista */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-premium p-3 flex items-center gap-3">
        <label className="flex-1 flex items-center gap-2.5 border border-slate-200 rounded-xl px-3.5 py-2.5
          bg-slate-50/50 hover:bg-white focus-within:bg-white focus-within:border-indigo-500
          focus-within:ring-3 focus-within:ring-indigo-50 transition-all cursor-text">
          <Icon d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" size="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Buscar servicios por título, categoría o estado..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-0 p-0 text-sm text-slate-700 placeholder-slate-400 focus:ring-0 outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-slate-300 hover:text-slate-500 transition-colors">
              <Icon d="M6 18L18 6M6 6l12 12" size="w-3.5 h-3.5" />
            </button>
          )}
        </label>

        {/* Toggle vista */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl flex-shrink-0">
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-slate-700' : 'text-slate-400 hover:text-slate-600'}`}
            title="Vista tabla"
          >
            <Icon d="M4 6h16M4 10h16M4 14h16M4 18h16" size="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-slate-700' : 'text-slate-400 hover:text-slate-600'}`}
            title="Vista tarjetas"
          >
            <Icon d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" size="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Contenido */}
      {loading ? (
        /* Skeleton tabla */
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-premium">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Servicio', 'Categoría', 'Precio', 'Estado', 'Acciones'].map((h) => (
                  <th key={h} className="py-3.5 px-5 text-left text-2xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>{[1, 2, 3, 4].map((n) => <RowSkeleton key={n} />)}</tbody>
          </table>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl p-14 text-center shadow-premium space-y-4">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-300 rounded-2xl flex items-center justify-center mx-auto border border-emerald-100">
            <Icon d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" size="w-8 h-8" stroke={1.4} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-700">
              {searchQuery ? 'Sin resultados' : 'Aún no tienes servicios'}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
              {searchQuery
                ? 'Intenta cambiar los términos de búsqueda.'
                : 'Crea tu primer servicio para que los clientes puedan encontrarte.'}
            </p>
          </div>
          {!searchQuery && (
            <Link to="/services/create" className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all">
              <Icon d="M12 4v16m8-8H4" size="w-4 h-4" />
              Crear primer servicio
            </Link>
          )}
        </div>
      ) : viewMode === 'table' ? (
        /* VISTA TABLA */
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-premium">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/60 border-b border-slate-100">
                  <th className="py-3.5 px-5 text-2xs font-bold text-slate-400 uppercase tracking-wider">Servicio</th>
                  <th className="py-3.5 px-5 text-2xs font-bold text-slate-400 uppercase tracking-wider">Categoría</th>
                  <th className="py-3.5 px-5 text-2xs font-bold text-slate-400 uppercase tracking-wider text-right">Precio</th>
                  <th className="py-3.5 px-5 text-2xs font-bold text-slate-400 uppercase tracking-wider text-center">Estado</th>
                  <th className="py-3.5 px-5 text-2xs font-bold text-slate-400 uppercase tracking-wider text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredServices.map((service) => (
                  <tr key={service.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-5">
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">
                        {service.title}
                      </p>
                      <p className="text-2xs text-slate-400 max-w-xs truncate mt-0.5">{service.description}</p>
                    </td>
                    <td className="py-4 px-5"><CategoryBadge cat={service.category} /></td>
                    <td className="py-4 px-5 text-right">
                      <span className="text-sm font-bold text-slate-800">${Number(service.price).toFixed(2)}</span>
                    </td>
                    <td className="py-4 px-5 text-center"><StatusBadge status={service.status} /></td>
                    <td className="py-4 px-5">
                      <div className="flex items-center justify-center gap-1.5">
                        <Link
                          to={`/services/${service.id}/edit`}
                          state={{ service }}
                          title="Editar"
                          className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50
                            border border-transparent hover:border-indigo-100 transition-all"
                        >
                          <Icon d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" size="w-4 h-4" stroke={1.8} />
                        </Link>
                        <button
                          onClick={() => confirmDelete(service)}
                          title="Eliminar"
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50
                            border border-transparent hover:border-rose-100 transition-all"
                        >
                          <Icon d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" size="w-4 h-4" stroke={1.8} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-slate-50 bg-slate-50/30">
            <p className="text-2xs text-slate-400">{filteredServices.length} servicio{filteredServices.length !== 1 ? 's' : ''} encontrado{filteredServices.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      ) : (
        /* VISTA GRID */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((service) => (
            <div key={service.id} className="group bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden
              hover:shadow-premium-hover hover:border-indigo-100 hover:-translate-y-0.5 transition-all duration-200">
              {/* Banda estado */}
              <div className={`h-1 ${service.status === 'APPROVED' ? 'bg-emerald-400' : service.status === 'REJECTED' ? 'bg-rose-400' : 'bg-amber-400'}`} />
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <CategoryBadge cat={service.category} />
                  <StatusBadge status={service.status} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 group-hover:text-indigo-700 transition-colors line-clamp-1">{service.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{service.description}</p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                  <span className="text-base font-extrabold font-display text-indigo-600">${Number(service.price).toFixed(2)}</span>
                  <div className="flex items-center gap-1">
                    <Link
                      to={`/services/${service.id}/edit`}
                      state={{ service }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all"
                    >
                      <Icon d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" size="w-4 h-4" stroke={1.8} />
                    </Link>
                    <button
                      onClick={() => confirmDelete(service)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all"
                    >
                      <Icon d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" size="w-4 h-4" stroke={1.8} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN — solo mejora visual de animación y backdrop */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fadeIn" onClick={() => setDeleteModalOpen(false)} />
          <div className="relative z-10 bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-scaleIn">
            {/* Banda roja */}
            <div className="h-1 bg-rose-500 w-full" />
            <div className="p-6 space-y-4">
              <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center border border-rose-100">
                <Icon d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" size="w-6 h-6" stroke={1.8} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">¿Eliminar este servicio?</h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Se eliminará permanentemente el servicio <strong>"{serviceToDelete?.title}"</strong>. Esta acción no se puede deshacer.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold
                    hover:bg-slate-50 transition-all disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5
                    bg-rose-600 hover:bg-rose-700 active:scale-95
                    text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
                >
                  {deleting ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Eliminando...
                    </>
                  ) : 'Eliminar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
