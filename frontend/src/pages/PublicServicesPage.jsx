import { useEffect, useState } from 'react';
import serviceService from '../services/serviceService.js';

const categories = ["Todas", "Educación", "Tecnología", "Música", "Limpieza", "Salud", "Hogar"];

/**
 * Vista para que los demandantes (USER) exploren, busquen, filtren y ordenen servicios aprobados.
 */
const PublicServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Estados de Filtros
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todas');
  const [sort, setSort] = useState('recent');

  // Estados de Paginación
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    // Resetear a página 1 al cambiar filtros principales
    setPage(1);
  }, [search, category, sort]);

  useEffect(() => {
    fetchServices();
  }, [search, category, sort, page]);

  const fetchServices = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await serviceService.getPublicServices({
        search: search.trim(),
        category,
        sort,
        page,
        limit: 10,
      });
      setServices(response.data || []);
      if (response.pagination) {
        setTotalPages(response.pagination.pages || 1);
        setTotalCount(response.pagination.total || 0);
      }
    } catch (error) {
      console.error(error);
      setErrorMsg(
        error.response?.data?.message || 'No se pudo establecer conexión para cargar el catálogo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Encabezado */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 md:text-2xl">Explorar Servicios</h2>
        <p className="text-xs text-slate-500 mt-1">
          Encuentra los mejores profesionales y talentos locales aprobados en tu comunidad.
        </p>
      </div>

      {/* Banner de error */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs flex items-start gap-2.5 animate-fadeIn">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Panel de Filtros */}
      <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Buscador */}
        <div className="md:col-span-6 flex items-center gap-3 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/50 hover:bg-slate-50 focus-within:bg-white focus-within:border-indigo-500 transition-all">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por título o descripción..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border-0 p-0 text-slate-700 placeholder-slate-400 focus:ring-0 text-xs outline-none"
          />
        </div>

        {/* Categoría */}
        <div className="md:col-span-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-slate-200 rounded-xl p-2.5 text-xs bg-white text-slate-700 focus:border-indigo-500 outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'Todas' ? 'Todas las categorías' : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Ordenamiento */}
        <div className="md:col-span-3">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full border border-slate-200 rounded-xl p-2.5 text-xs bg-white text-slate-700 focus:border-indigo-500 outline-none"
          >
            <option value="recent">Más recientes</option>
            <option value="price_asc">Menor precio primero</option>
            <option value="price_desc">Mayor precio primero</option>
          </select>
        </div>
      </div>

      {/* Resultados */}
      {loading ? (
        <div className="bg-white border border-slate-150 rounded-2xl p-12 text-center shadow-xs">
          <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400 mt-3 font-medium">Buscando servicios en tu área...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white border border-slate-150 rounded-2xl p-12 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center mx-auto border border-slate-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-slate-700">Sin resultados</h3>
          <p className="text-2xs text-slate-400 max-w-xs mx-auto">
            No se encontraron servicios con los filtros seleccionados. Intenta ampliar tus términos de búsqueda.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Grid de Tarjetas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white border border-slate-150 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all duration-200"
              >
                <div className="space-y-3">
                  {/* Categoría y Precio */}
                  <div className="flex items-center justify-between">
                    <span className="bg-indigo-50/70 text-indigo-600 border border-indigo-100 text-2xs font-semibold px-2.5 py-0.5 rounded-full">
                      {service.category}
                    </span>
                    <span className="text-sm font-extrabold text-indigo-600 bg-indigo-50/40 px-3 py-1 rounded-lg">
                      ${service.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Título y Descripción */}
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm hover:text-indigo-600 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-3">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Footer de Tarjeta con Proveedor y Botón Solicitar */}
                <div className="border-t border-slate-100 mt-5 pt-4 flex items-center justify-between gap-4">
                  {/* Host Info */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs">
                      {service.owner?.nombre[0] || 'T'}
                      {service.owner?.apellido[0] || 'L'}
                    </div>
                    <div>
                      <p className="text-2xs font-semibold text-slate-700 leading-none">
                        {service.owner ? `${service.owner.nombre} ${service.owner.apellido}` : 'Talento Local'}
                      </p>
                      <p className="text-3xs text-slate-400 mt-0.5">Host de la comunidad</p>
                    </div>
                  </div>

                  {/* Botón de Acción (Preparado para Sprint posterior) */}
                  <button
                    disabled
                    className="px-3 py-1.5 bg-slate-100 text-slate-400 rounded-lg text-3xs font-bold border border-slate-200 cursor-not-allowed hover:bg-slate-100 transition-all flex-shrink-0"
                    title="Solicitudes próximamente"
                  >
                    Solicitar Servicio
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Controles de Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-150 pt-4 text-xs font-medium text-slate-500">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50 disabled:hover:bg-transparent"
              >
                Anterior
              </button>
              <span>
                Página <span className="font-semibold text-slate-800">{page}</span> de{' '}
                <span className="font-semibold text-slate-800">{totalPages}</span> ({totalCount} resultados)
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-3 py-1.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50 disabled:hover:bg-transparent"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PublicServicesPage;
