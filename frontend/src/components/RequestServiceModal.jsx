import { useState } from 'react';
import serviceRequestService from '../services/serviceRequestService.js';
import PaymentMethodSelector from './PaymentMethodSelector.jsx';

/* ── Toda la lógica es idéntica al original. Solo mejoras visuales. ── */

const Icon = ({ d, size = 'w-4 h-4', stroke = 2 }) => (
  <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={stroke} d={d} />
  </svg>
);

const InputField = ({ label, id, name, type = 'text', placeholder, value, onChange, error, hint, ...rest }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="flex items-center justify-between">
      <span className="text-xs font-semibold text-slate-700">{label}</span>
      {hint && <span className="text-2xs text-slate-400">{hint}</span>}
    </label>
    <input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full border rounded-xl px-3.5 py-2.5 text-sm
        bg-slate-50/50 hover:bg-white focus:bg-white
        transition-all outline-none
        ${error
          ? 'border-rose-300 focus:border-rose-500 focus:ring-3 focus:ring-rose-50 text-rose-900 placeholder-rose-300'
          : 'border-slate-200 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-50 text-slate-800 placeholder-slate-400'
        }`}
      {...rest}
    />
    {error && (
      <p className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
        <Icon d="M12 9v2m0 4h.01" size="w-3.5 h-3.5" />
        {error}
      </p>
    )}
  </div>
);

const RequestServiceModal = ({ service, onClose }) => {
  const [formData, setFormData] = useState({
    message: '',
    contactPhone: '',
    desiredDate: '',
    paymentMethod: 'CASH',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  /* Handlers — sin cambios */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePaymentChange = (method) => {
    setFormData((prev) => ({ ...prev, paymentMethod: method }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setValidationErrors({});

    const errors = {};
    if (!formData.message.trim()) errors.message = 'El mensaje para el proveedor es obligatorio.';
    if (!formData.contactPhone.trim()) {
      errors.contactPhone = 'El teléfono de contacto es obligatorio.';
    } else if (formData.contactPhone.trim().length < 7) {
      errors.contactPhone = 'El teléfono debe tener al menos 7 dígitos.';
    }
    if (!formData.desiredDate) {
      errors.desiredDate = 'La fecha deseada de ejecución es obligatoria.';
    } else {
      const parsedDate = new Date(formData.desiredDate);
      if (parsedDate < new Date()) errors.desiredDate = 'La fecha debe ser en el futuro.';
    }
    if (!formData.paymentMethod) {
      errors.paymentMethod = 'El método de pago es obligatorio.';
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
        paymentMethod: formData.paymentMethod,
      });
      setSuccess(true);
      setTimeout(() => { onClose(); }, 2500);
    } catch (err) {
      console.error(err);
      if (err.response?.data?.error === 'ValidationError') {
        const errorsMap = {};
        err.response.data.errors.forEach((e) => { errorsMap[e.campo] = e.mensaje; });
        setValidationErrors(errorsMap);
      } else {
        setErrorMsg(err.response?.data?.message || 'Ocurrió un error inesperado al enviar la solicitud.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      {/* Backdrop con blur premium */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Panel modal */}
      <div className="relative z-10 w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl
        animate-slideUp sm:animate-scaleIn overflow-hidden my-8">

        {/* Header del modal */}
        <div className="relative bg-gradient-to-br from-indigo-600 to-indigo-700 p-5 text-white">
          {/* Decoración */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8 blur-xl" />

          <div className="relative flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-white/15 border border-white/20 px-2.5 py-1 rounded-full mb-2">
                <Icon d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" size="w-3 h-3" />
                <span className="text-2xs font-bold uppercase tracking-widest">Nueva solicitud</span>
              </div>
              <h3 className="font-display font-bold text-base leading-tight line-clamp-1">
                {service.title}
              </h3>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-white/70 text-xs">
                  {service.owner?.nombre} {service.owner?.apellido}
                </span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span className="text-lg font-extrabold leading-none">
                  ${service.price.toFixed(2)}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors flex-shrink-0"
            >
              <Icon d="M6 18L18 6M6 6l12 12" size="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 max-h-[75vh] overflow-y-auto">
          {success ? (
            /* ── Estado de Éxito ── */
            <div className="py-8 text-center space-y-4 animate-fadeIn">
              <div className="relative mx-auto w-16 h-16">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center border-2 border-emerald-200">
                  <Icon d="M5 13l4 4L19 7" size="w-7 h-7 text-emerald-600" stroke={2.5} />
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-emerald-300 animate-ping opacity-30" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-800">¡Solicitud enviada!</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1.5 leading-relaxed">
                  Tu solicitud fue registrada. El proveedor revisará tu mensaje y se pondrá en contacto a la brevedad.
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                <Icon d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" size="w-3.5 h-3.5" />
                Cerrando automáticamente...
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error global */}
              {errorMsg && (
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-3.5 flex gap-2.5 text-rose-700 text-xs font-medium animate-fadeIn">
                  <Icon d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" size="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Fila: teléfono + fecha */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Teléfono de contacto"
                  id="contactPhone"
                  name="contactPhone"
                  placeholder="+56912345678"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  error={validationErrors.contactPhone}
                  hint="Obligatorio"
                />
                <InputField
                  label="Fecha deseada"
                  id="desiredDate"
                  name="desiredDate"
                  type="date"
                  value={formData.desiredDate}
                  onChange={handleChange}
                  error={validationErrors.desiredDate}
                  hint="Futura"
                />
              </div>

              {/* Selector de Método de Pago */}
              <PaymentMethodSelector
                value={formData.paymentMethod}
                onChange={handlePaymentChange}
              />
              {validationErrors.paymentMethod && (
                <p className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
                  <Icon d="M12 9v2m0 4h.01" size="w-3.5 h-3.5" />
                  {validationErrors.paymentMethod}
                </p>
              )}

              {/* Mensaje */}
              <div className="space-y-1.5">
                <label htmlFor="message" className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">Mensaje o detalles del pedido</span>
                  <span className="text-2xs text-slate-400">{formData.message.length} / 500</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  maxLength={500}
                  placeholder="Indica horarios preferentes, dirección o detalles de lo que necesitas..."
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-sm
                    bg-slate-50/50 hover:bg-white focus:bg-white
                    transition-all outline-none resize-none
                    ${validationErrors.message
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-3 focus:ring-rose-50'
                      : 'border-slate-200 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-50'
                    }`}
                />
                {validationErrors.message && (
                  <p className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
                    <Icon d="M12 9v2m0 4h.01" size="w-3.5 h-3.5" />
                    {validationErrors.message}
                  </p>
                )}
              </div>

              {/* Nota informativa */}
              <div className="flex items-start gap-2.5 p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl">
                <Icon d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" size="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                <p className="text-2xs text-indigo-700 leading-relaxed">
                  El proveedor recibirá tu solicitud y decidirá aceptarla o rechazarla. Podrás hacer seguimiento desde <strong>Mis Solicitudes</strong>.
                </p>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 border border-slate-200 hover:bg-slate-50 hover:border-slate-300
                    rounded-xl text-sm font-semibold text-slate-600 transition-all disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5
                    bg-indigo-600 hover:bg-indigo-700 active:scale-95
                    text-white rounded-xl text-sm font-semibold shadow-sm hover:shadow
                    transition-all disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Icon d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" size="w-4 h-4" />
                      Enviar Solicitud
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestServiceModal;
