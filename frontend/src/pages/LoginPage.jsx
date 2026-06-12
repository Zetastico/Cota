import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

/**
 * Página de inicio de sesión
 * Diseño minimalista premium estilo Stripe/Notion
 */
const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Estados del formulario y UI
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validaciones locales rápidas
  const validateForm = () => {
    const errors = {};
    if (!email) {
      errors.email = 'El correo electrónico es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'El formato del correo electrónico es inválido.';
    }
    if (!password) {
      errors.password = 'La contraseña es obligatoria.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const userData = await login(email, password);
      // Éxito: redireccionar según rol
      if (userData?.rol === 'USER') {
        navigate('/services/explore');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      // Intentar extraer el mensaje del error de la API
      const apiMessage = err.response?.data?.message || 'Error al conectar con el servidor. Intenta de nuevo.';
      setErrorMsg(apiMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* Columna Izquierda: Panel Hero (solo en desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-indigo-900 via-brand-700 to-brand-600 text-white flex-col justify-between p-12 overflow-hidden">
        {/* Decoraciones de fondo */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" />

        {/* Encabezado del Hero */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center font-display font-bold text-xl tracking-wider border border-white/20 shadow-inner-xs">
            C
          </div>
          <span className="font-display font-semibold tracking-wide text-lg">COTAL</span>
        </div>

        {/* Centro del Hero: Mensaje y Composición Visual */}
        <div className="relative z-10 my-auto max-w-lg space-y-8 animate-slideUp">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Talento local de confianza
            </span>
            <h1 className="text-4xl xl:text-5xl font-display font-bold leading-tight tracking-tight">
              Conecta con talentos locales y encuentra servicios de confianza.
            </h1>
            <p className="text-indigo-200 text-base leading-relaxed">
              Únete a la red más activa de profesionales locales. Encuentra el especialista ideal para tu proyecto o comparte tu talento con la comunidad.
            </p>
          </div>

          {/* Tarjetas flotantes premium */}
          <div className="space-y-4 pt-4 text-slate-900">
            {/* Tarjeta 1 */}
            <div className="glass p-5 rounded-2xl border border-white/10 shadow-premium flex items-center gap-4 hover:translate-x-2 transition-transform duration-300">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center font-bold text-white text-lg shadow-sm">
                MS
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-slate-900 text-sm">Mateo Silva</h4>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">Disponible</span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Electricista Certificado</p>
                <div className="flex items-center gap-1 mt-1.5 text-xs text-amber-500 font-semibold">
                  <span>★ 4.9</span>
                  <span className="text-slate-400 font-normal">(120 reseñas)</span>
                </div>
              </div>
            </div>

            {/* Tarjeta 2 */}
            <div className="glass p-5 rounded-2xl border border-white/10 shadow-premium flex items-center gap-4 hover:translate-x-2 transition-transform duration-300 delay-100">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-400 to-indigo-500 flex items-center justify-center font-bold text-white text-lg shadow-sm">
                ER
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-slate-900 text-sm">Elena Rivas</h4>
                  <span className="text-[10px] bg-indigo-500/10 text-indigo-700 px-2 py-0.5 rounded-full font-semibold">Diseño</span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Diseñadora de Interiores</p>
                <div className="flex items-center gap-1 mt-1.5 text-xs text-amber-500 font-semibold">
                  <span>★ 4.8</span>
                  <span className="text-slate-400 font-normal">(95 reseñas)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer del Hero */}
        <div className="relative z-10 text-xs text-indigo-200/60 flex justify-between items-center">
          <span>© 2026 COTAL. Todos los derechos reservados.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Términos</a>
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
          </div>
        </div>
      </div>

      {/* Columna Derecha: Formulario */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 md:p-20 relative bg-slate-50">
        {/* Fondo decorativo móvil */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-indigo-50/20 via-slate-50 to-indigo-50/20 pointer-events-none lg:hidden" />
        
        <div className="w-full max-w-md relative z-10 space-y-8 animate-fadeIn">
          {/* Logo móvil */}
          <div className="lg:hidden text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-700 flex items-center justify-center text-white font-display font-bold text-2xl shadow-premium mb-3">
              C
            </div>
            <h1 className="text-2xl font-display font-bold text-slate-900">COTAL</h1>
          </div>

          <div className="text-left">
            <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
              Bienvenido de nuevo
            </h2>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Ingresa a tu cuenta de COTAL para gestionar tu talento local y servicios.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-premium hover:shadow-premium-hover transition-all duration-300">
            {errorMsg && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-700 text-xs flex items-start gap-3 animate-fadeIn">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="font-medium">{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Input Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input
                    id="email"
                    type="email"
                    placeholder="ejemplo@correo.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (validationErrors.email) setValidationErrors(prev => ({ ...prev, email: '' }));
                    }}
                    disabled={isSubmitting}
                    className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-2xl text-sm focus:outline-none focus:ring-4 transition-all ${
                      validationErrors.email
                        ? 'border-rose-300 focus:ring-rose-100 focus:bg-white text-rose-950 placeholder-rose-300'
                        : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 focus:bg-white text-slate-900'
                    }`}
                  />
                </div>
                {validationErrors.email && (
                  <p className="mt-1 text-2xs text-rose-500 font-semibold flex items-center gap-1 animate-slideIn">
                    <span className="w-1 h-1 rounded-full bg-rose-500" />
                    {validationErrors.email}
                  </p>
                )}
              </div>

              {/* Input Contraseña */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Contraseña
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (validationErrors.password) setValidationErrors(prev => ({ ...prev, password: '' }));
                    }}
                    disabled={isSubmitting}
                    className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-2xl text-sm focus:outline-none focus:ring-4 transition-all ${
                      validationErrors.password
                        ? 'border-rose-300 focus:ring-rose-100 focus:bg-white text-rose-950 placeholder-rose-300'
                        : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 focus:bg-white text-slate-900'
                    }`}
                  />
                </div>
                {validationErrors.password && (
                  <p className="mt-1 text-2xs text-rose-500 font-semibold flex items-center gap-1 animate-slideIn">
                    <span className="w-1 h-1 rounded-full bg-rose-500" />
                    {validationErrors.password}
                  </p>
                )}
              </div>

              {/* Botón de Enviar */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center py-3 px-4 rounded-2xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-750 active:scale-98 focus:ring-4 focus:ring-indigo-100 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Iniciando sesión...</span>
                  </div>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </form>
          </div>

          {/* Enlace de Registro */}
          <p className="text-center text-sm text-slate-500">
            ¿No tienes una cuenta?{' '}
            <Link
              to="/register"
              className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-all"
            >
              Crea tu cuenta aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
