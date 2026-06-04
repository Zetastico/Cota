import { useState } from 'react';
import serviceRequestService from '../services/serviceRequestService.js';

/**
 * Modal interactivo para solicitar un servicio (USER)
 * @param {Object} service - Datos del servicio a solicitar
 * @param {Function} onClose - Función para cerrar el modal
 */
const RequestServiceModal = ({ service, onClose }) => {
  const [formData, setFormData] = useState({
    message: '',
    contactPhone: '',
    desiredDate: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

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
    setLoading(true);
    setErrorMsg('');
    setValidationErrors({});

    // Validaciones en cliente
    const errors = {};
    if (!formData.message.trim()) {
      errors.message = 'El mensaje para el proveedor es obligatorio.';
    }
    if (!formData.contactPhone.trim()) {
      errors.contactPhone = 'El teléfono de contacto es obligatorio.';
    } else if (formData.contactPhone.trim().length < 7) {
      errors.contactPhone = 'El teléfono debe tener al menos 7 dígitos.';
    }
    if (!formData.desiredDate) {
      errors.desiredDate = 'La fecha deseada de ejecución es obligatoria.';
    } else {
      const parsedDate = new Date(formData.desiredDate);
      if (parsedDate < new Date()) {
        errors.desiredDate = 'La fecha debe ser en el futuro.';
      }
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setLoading(false);
      return;
    }

    try {
      await serviceRequestService.createRequest({
        serviceId: service.id,
        message: formData.message.trim(),
        contactPhone: formData.contactPhone.trim(),
        desiredDate: formData.desiredDate,
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2500);
    } catch (err) {
      console.error(err);
      if (err.response?.data?.error === 'ValidationError') {
        const errorsMap = {};
        err.response.data.errors.forEach((e) => {
          errorsMap[e.campo] = e.mensaje;
        });
        setValidationErrors(errorsMap);
      } else {
        setErrorMsg(
          err.response?.data?.message || 'Ocurrió un error inesperado al enviar la solicitud.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose}></div>
      
      {/* Ventana Modal */}
      <div className="bg-white border border-slate-150 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative z-10 animate-scaleUp p-6">
        
        {/* Encabezado */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Solicitar Servicio</h3>
            <p className="text-3xs text-slate-400 mt-0.5">
              Servicio: <span className="font-semibold text-slate-600">{service.title}</span> - ${service.price.toFixed(2)}
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido / Formularios */}
        {success ? (
          <div className="py-8 text-center space-y-3 animate-fadeIn">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center border border-emerald-100 mx-auto">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-sm font-semibold text-slate-800">¡Solicitud enviada con éxito!</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Tu solicitud ha sido registrada correctamente. El proveedor revisará tu mensaje y se pondrá en contacto.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            
            {/* Alerta de Error */}
            {errorMsg && (
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 flex gap-2 text-rose-800 text-xs font-medium animate-fadeIn">
                <svg className="w-4 h-4 flex-shrink-0 text-rose-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Teléfono y Fecha */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="contactPhone" className="block text-3xs font-semibold uppercase tracking-wider text-slate-400">
                  Teléfono de Contacto
                </label>
                <input
                  type="text"
                  id="contactPhone"
                  name="contactPhone"
                  placeholder="Ej. +56912345678"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  className={`w-full border rounded-xl p-2.5 text-xs bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all outline-none ${
                    validationErrors.contactPhone ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500'
                  }`}
                />
                {validationErrors.contactPhone && (
                  <p className="text-3xs font-medium text-rose-600 mt-0.5">{validationErrors.contactPhone}</p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="desiredDate" className="block text-3xs font-semibold uppercase tracking-wider text-slate-400">
                  Fecha Deseada
                </label>
                <input
                  type="date"
                  id="desiredDate"
                  name="desiredDate"
                  value={formData.desiredDate}
                  onChange={handleChange}
                  className={`w-full border rounded-xl p-2.5 text-xs bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all outline-none ${
                    validationErrors.desiredDate ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500'
                  }`}
                />
                {validationErrors.desiredDate && (
                  <p className="text-3xs font-medium text-rose-600 mt-0.5">{validationErrors.desiredDate}</p>
                )}
              </div>
            </div>

            {/* Mensaje */}
            <div className="space-y-1">
              <label htmlFor="message" className="block text-3xs font-semibold uppercase tracking-wider text-slate-400">
                Mensaje o Detalles del Pedido
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                placeholder="Indica horarios preferentes, dirección o detalles de lo que necesitas..."
                value={formData.message}
                onChange={handleChange}
                className={`w-full border rounded-xl p-2.5 text-xs bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all outline-none resize-none ${
                  validationErrors.message ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500'
                }`}
              />
              {validationErrors.message && (
                <p className="text-3xs font-medium text-rose-600 mt-0.5">{validationErrors.message}</p>
              )}
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-3 border-t border-slate-100 mt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-600 transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
              >
                {loading ? 'Enviando...' : 'Enviar Solicitud'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RequestServiceModal;
