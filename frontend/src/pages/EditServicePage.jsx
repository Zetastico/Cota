import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import serviceService from '../services/serviceService.js';

/**
 * Página de edición de servicios para HOST
 */
const EditServicePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    loadService();
  }, [id]);

  const loadService = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      // 1. Intentar obtener de location.state si se navegó desde el listado
      if (location.state?.service) {
        const { title, description, price, category } = location.state.service;
        setFormData({ title, description, price: price.toString(), category });
        setLoading(false);
        return;
      }

      // 2. Si no, buscar en la lista de mis servicios del HOST
      const response = await serviceService.getMyServices();
      const service = response.data.find((s) => s.id === id);

      if (!service) {
        setErrorMsg('El servicio no existe o no tiene permisos para editarlo.');
      } else {
        const { title, description, price, category } = service;
        setFormData({ title, description, price: price.toString(), category });
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('No se pudo cargar la información del servicio.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    setValidationErrors({});

    // Validaciones locales rápidas
    const errors = {};
    if (!formData.title.trim()) errors.title = 'El título es obligatorio.';
    if (!formData.description.trim()) errors.description = 'La descripción es obligatoria.';
    if (!formData.category.trim()) errors.category = 'La categoría es obligatoria.';
    if (!formData.price) {
      errors.price = 'El precio es obligatorio.';
    } else if (parseFloat(formData.price) <= 0) {
      errors.price = 'El precio debe ser mayor a 0.';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setSaving(false);
      return;
    }

    try {
      await serviceService.updateService(id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category.trim(),
      });
      navigate('/services');
    } catch (err) {
      console.error(err);
      if (err.response?.data?.error === 'ValidationError') {
        const errorsMap = {};
        err.response.data.errors.forEach((e) => {
          errorsMap[e.campo] = e.mensaje;
        });
        setValidationErrors(errorsMap);
      } else {
        setErrorMsg(err.response?.data?.message || 'Hubo un error al actualizar el servicio.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Botón de retroceso y Título */}
      <div className="space-y-2">
        <Link
          to="/services"
          className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors text-xs font-semibold"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a Mis Servicios
        </Link>
        <h2 className="text-xl font-bold text-slate-900 md:text-2xl">Editar Servicio</h2>
        <p className="text-xs text-slate-500">
          Edita la información de tu oferta. Al guardar los cambios, el servicio volverá a estado <span className="font-semibold text-amber-600">Pendiente</span> para revisión.
        </p>
      </div>

      {/* Banners */}
      {errorMsg && (
        <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex gap-3 text-rose-800 text-xs font-medium animate-fadeIn">
          <svg className="w-5 h-5 flex-shrink-0 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="bg-white border border-slate-150 rounded-2xl p-12 text-center shadow-xs">
          <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400 mt-3 font-medium">Cargando datos del servicio...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-150 rounded-2xl shadow-xs p-6 space-y-5">
          <div className="space-y-1">
            <label htmlFor="title" className="block text-2xs font-semibold uppercase tracking-wider text-slate-400">
              Título del Servicio
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full border rounded-xl p-3 text-xs bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all outline-none ${
                validationErrors.title ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-slate-200 focus:border-indigo-500'
              }`}
            />
            {validationErrors.title && (
              <p className="text-2xs font-medium text-rose-600 mt-1">{validationErrors.title}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="category" className="block text-2xs font-semibold uppercase tracking-wider text-slate-400">
                Categoría
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full border rounded-xl p-3 text-xs bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all outline-none ${
                  validationErrors.category ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-slate-200 focus:border-indigo-500'
                }`}
              />
              {validationErrors.category && (
                <p className="text-2xs font-medium text-rose-600 mt-1">{validationErrors.category}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="price" className="block text-2xs font-semibold uppercase tracking-wider text-slate-400">
                Precio (USD)
              </label>
              <input
                type="number"
                step="0.01"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={`w-full border rounded-xl p-3 text-xs bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all outline-none ${
                  validationErrors.price ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-slate-200 focus:border-indigo-500'
                }`}
              />
              {validationErrors.price && (
                <p className="text-2xs font-medium text-rose-600 mt-1">{validationErrors.price}</p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="description" className="block text-2xs font-semibold uppercase tracking-wider text-slate-400">
              Descripción Detallada
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className={`w-full border rounded-xl p-3 text-xs bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all outline-none resize-none ${
                validationErrors.description ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-slate-200 focus:border-indigo-500'
              }`}
            />
            {validationErrors.description && (
              <p className="text-2xs font-medium text-rose-600 mt-1">{validationErrors.description}</p>
            )}
          </div>

          <div className="flex gap-3 pt-3 border-t border-slate-100">
            <Link
              to="/services"
              className="flex-1 inline-flex justify-center items-center px-4 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-600 transition-all"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 inline-flex justify-center items-center px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditServicePage;
