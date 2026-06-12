import { useEffect, useState } from 'react';
import serviceService from '../services/serviceService.js';
import RequestServiceModal from '../components/RequestServiceModal.jsx';
import useAuth from '../hooks/useAuth.js';
import { getCategoryImage } from '../services/categoryImages.js';

/* ── Lógica sin cambios ─── Todas las modificaciones son exclusivamente visuales ── */

const categories = [
  "Todas",
  "Educación",
  "Tecnología",
  "Música",
  "Limpieza",
  "Salud",
  "Hogar",
  "Cocina",
  "Arte",
  "Deporte",
  "Belleza",
  "Fotografía",
  "Transporte",
  "Reparación",
  "Mascotas"
];

/* Ícono SVG inline helper */
const Icon = ({ d, size = 'w-4 h-4', stroke = 1.8 }) => (
  <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={stroke} d={d} />
  </svg>
);

/* Skeleton de tarjeta */
const ServiceCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-premium animate-pulse flex flex-col">
    <div className="h-44 bg-slate-200 w-full" />
    <div className="p-5 space-y-4 flex-1">
      <div className="flex justify-between items-center">
        <div className="h-4 bg-slate-200 w-20 rounded-full" />
        <div className="h-4 bg-slate-200 w-16 rounded" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 w-3/4 rounded" />
        <div className="h-3 bg-slate-200 w-full rounded" />
        <div className="h-3 bg-slate-200 w-5/6 rounded" />
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-200" />
          <div className="space-y-1">
            <div className="h-3 bg-slate-200 w-16 rounded" />
            <div className="h-2 bg-slate-200 w-12 rounded" />
          </div>
        </div>
        <div className="h-8 bg-slate-200 w-20 rounded-xl" />
      </div>
    </div>
  </div>
);

/* Badge de categoría con color dinámico */
const categoryColors = {
  Educación:   'bg-blue-50 text-blue-700 border-blue-100',
  Tecnología:  'bg-violet-50 text-violet-700 border-violet-100',
  Música:      'bg-pink-50 text-pink-700 border-pink-100',
  Limpieza:    'bg-cyan-50 text-cyan-700 border-cyan-100',
  Salud:       'bg-emerald-50 text-emerald-700 border-emerald-100',
  Hogar:       'bg-amber-50 text-amber-700 border-amber-100',
  Cocina:      'bg-orange-50 text-orange-700 border-orange-100',
  Arte:        'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100',
  Deporte:     'bg-red-50 text-red-700 border-red-100',
  Belleza:     'bg-rose-50 text-rose-700 border-rose-100',
  Fotografía:  'bg-teal-50 text-teal-700 border-teal-100',
  Transporte:  'bg-sky-50 text-sky-700 border-sky-100',
  Reparación:  'bg-yellow-50 text-yellow-700 border-yellow-100',
  Mascotas:    'bg-lime-50 text-lime-700 border-lime-100',
};

const CategoryBadge = ({ cat }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-2xs font-bold border ${categoryColors[cat] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
    {cat}
  </span>
);

/* Tarjeta de servicio premium */
const ServiceCard = ({ service, isOwner, onRequestClick }) => {
  const initials = `${service.owner?.nombre?.[0] || 'T'}${service.owner?.apellido?.[0] || 'L'}`;
  const hostName = service.owner ? `${service.owner.nombre} ${service.owner.apellido}` : 'Talento Local';

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-premium flex flex-col
      hover:shadow-premium-hover hover:border-indigo-150 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">

      {/* Imagen Superior por Categoría */}
      <div className="relative h-44 w-full bg-slate-50 overflow-hidden">
        <img
          src={getCategoryImage(service.category)}
          alt={service.category}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1557683316-973673baf926?w=600&auto=format&fit=crop&q=80';
          }}
        />
        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        
        {/* Categoría Badge sobre la imagen */}
        <div className="absolute top-4 left-4 z-10">
          <CategoryBadge cat={service.category} />
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Título + Precio */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-indigo-700 transition-colors line-clamp-2 flex-1">
            {service.title}
          </h3>
          <div className="text-right flex-shrink-0">
            <span className="text-3xs font-bold text-slate-400 uppercase tracking-wider block">precio</span>
            <span className="text-base font-extrabold text-indigo-600 font-display block leading-none mt-0.5">
              ${service.price.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Descripción */}
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 flex-1">
          {service.description}
        </p>

        {/* Footer: host + CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-50 gap-3">
          {/* Host avatar + info */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-2xs font-semibold text-slate-700 truncate leading-none">{hostName}</p>
              
              {/* Host rating */}
              <div className="flex items-center gap-1.5 mt-1">
                {service.hostReviewsCount > 0 ? (
                  <>
                    <div className="flex text-amber-400">
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </div>
                    <span className="text-3xs font-extrabold text-slate-700 leading-none">
                      {service.hostAverageRating}
                    </span>
                    <span className="text-3xs text-slate-400 leading-none">
                      ({service.hostReviewsCount})
                    </span>
                  </>
                ) : (
                  <span className="text-3xs font-semibold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded leading-none">
                    Nuevo
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Botón de acción */}
          {isOwner ? (
            <span className="flex-shrink-0 text-2xs text-slate-400 bg-slate-50 border border-slate-105 px-2.5 py-1.5 rounded-xl font-semibold italic">
              Tu servicio
            </span>
          ) : (
            <button
              onClick={() => onRequestClick(service)}
              className="flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700
                text-white text-2xs font-bold rounded-xl shadow-sm hover:shadow active:scale-95 transition-all"
            >
              <Icon d="M12 6v6m0 0v6m0-6h6m-6 0H6" size="w-3 h-3" stroke={2.5} />
              Solicitar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════ */

const PublicServicesPage = () => {
  const { user: currentUser } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Estados de Filtros — sin cambios
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todas');
  const [sort, setSort] = useState('recent');

  // Estados de Paginación — sin cambios
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Estados del Modal — sin cambios
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [search, category, sort]);

  useEffect(() => {
    fetchServices();
  }, [search, category, sort, page]);

  // Lógica sin cambios
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

  const handleRequestClick = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* ── Hero de sección ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-[#3730a3] rounded-2xl p-6 md:p-8 text-white">
        {/* Decoraciones */}
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-1/4 w-24 h-24 bg-white/5 rounded-full blur-xl" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}
        />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 px-3 py-1 rounded-full mb-3">
              <Icon d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" size="w-3 h-3" stroke={2.5} />
              <span className="text-2xs font-bold uppercase tracking-widest text-white/90">Catálogo de Servicios</span>
            </div>
            <h2 className="text-xl md:text-2xl font-display font-extrabold leading-tight">
              Explorar Servicios
            </h2>
            <p className="mt-1.5 text-sm text-white/70 max-w-md">
              Encuentra los mejores profesionales y talentos locales aprobados en tu comunidad.
            </p>
          </div>
          {totalCount > 0 && !loading && (
            <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl px-5 py-3 text-center flex-shrink-0">
              <p className="text-2xl font-display font-extrabold leading-none">{totalCount}</p>
              <p className="text-2xs text-white/70 mt-1 font-medium">servicios disponibles</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Banner de error ── */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs flex items-start gap-2.5 animate-fadeIn">
          <Icon d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" size="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ── Panel de Filtros Premium ── */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-premium p-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">

          {/* Buscador */}
          <label className="md:col-span-6 flex items-center gap-2.5 border border-slate-200 rounded-xl px-3.5 py-2.5
            bg-slate-50/50 hover:bg-white hover:border-slate-300 focus-within:bg-white focus-within:border-indigo-500
            focus-within:ring-3 focus-within:ring-indigo-50 transition-all cursor-text">
            <Icon d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" size="w-4 h-4 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Buscar por título o descripción..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent border-0 p-0 text-sm text-slate-700 placeholder-slate-400 focus:ring-0 outline-none"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-slate-300 hover:text-slate-500 transition-colors flex-shrink-0">
                <Icon d="M6 18L18 6M6 6l12 12" size="w-3.5 h-3.5" stroke={2} />
              </button>
            )}
          </label>

          {/* Categoría */}
          <div className="md:col-span-3 relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full appearance-none border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm
                bg-slate-50/50 text-slate-700 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-50 outline-none
                hover:border-slate-300 transition-all cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat === 'Todas' ? 'Todas las categorías' : cat}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Icon d="M19 9l-7 7-7-7" size="w-3.5 h-3.5" stroke={2} />
            </div>
          </div>

          {/* Ordenamiento */}
          <div className="md:col-span-3 relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full appearance-none border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm
                bg-slate-50/50 text-slate-700 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-50 outline-none
                hover:border-slate-300 transition-all cursor-pointer"
            >
              <option value="recent">Más recientes</option>
              <option value="price_asc">Menor precio</option>
              <option value="price_desc">Mayor precio</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Icon d="M19 9l-7 7-7-7" size="w-3.5 h-3.5" stroke={2} />
            </div>
          </div>
        </div>

        {/* Filtros activos */}
        {(search || category !== 'Todas') && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-50">
            <span className="text-2xs text-slate-400 font-medium">Filtros activos:</span>
            {search && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-2xs font-semibold">
                "{search}"
                <button onClick={() => setSearch('')} className="hover:text-indigo-900">×</button>
              </span>
            )}
            {category !== 'Todas' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-2xs font-semibold">
                {category}
                <button onClick={() => setCategory('Todas')} className="hover:text-indigo-900">×</button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Contenido principal ── */}
      {loading ? (
        /* Skeleton grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((n) => <ServiceCardSkeleton key={n} />)}
        </div>
      ) : services.length === 0 ? (
        /* Estado vacío */
        <div className="bg-white border border-slate-100 rounded-2xl p-14 text-center shadow-premium space-y-4">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-300 rounded-2xl flex items-center justify-center mx-auto border border-indigo-100">
            <Icon d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" size="w-8 h-8" stroke={1.4} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-700">Sin resultados</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
              No se encontraron servicios con los filtros actuales. Intenta ampliar tu búsqueda o cambiar la categoría.
            </p>
          </div>
          {(search || category !== 'Todas') && (
            <button
              onClick={() => { setSearch(''); setCategory('Todas'); }}
              className="inline-flex items-center gap-2 px-4 py-2 border border-indigo-200 text-indigo-600 rounded-xl text-xs font-semibold hover:bg-indigo-50 transition-all"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          {/* Grid de tarjetas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                isOwner={currentUser && currentUser.id === service.ownerId}
                onRequestClick={handleRequestClick}
              />
            ))}
          </div>

          {/* Paginación premium */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white border border-slate-100 rounded-2xl px-5 py-3 shadow-premium">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold
                  text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Icon d="M15 19l-7-7 7-7" size="w-3.5 h-3.5" stroke={2} />
                Anterior
              </button>
              <span className="text-xs text-slate-500">
                Página <span className="font-bold text-slate-800">{page}</span> de{' '}
                <span className="font-bold text-slate-800">{totalPages}</span>
                <span className="hidden sm:inline text-slate-400"> · {totalCount} resultados</span>
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold
                  text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Siguiente
                <Icon d="M9 5l7 7-7 7" size="w-3.5 h-3.5" stroke={2} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal de Solicitud — sin cambios funcionales */}
      {isModalOpen && selectedService && (
        <RequestServiceModal
          service={selectedService}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedService(null);
          }}
        />
      )}
    </div>
  );
};

export default PublicServicesPage;
