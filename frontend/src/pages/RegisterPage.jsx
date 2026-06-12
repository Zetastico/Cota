import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

/**
 * Página de registro de usuarios
 * Estilo premium SaaS responsive
 */
const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  // Estados del formulario
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rol, setRol] = useState('USER');

  // Estados de carga e informes
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validaciones del lado del cliente
  const validateForm = () => {
    const errors = {};
    if (!nombre.trim()) errors.nombre = 'El nombre es obligatorio.';
    if (!apellido.trim()) errors.apellido = 'El apellido es obligatorio.';
    
    if (!email) {
      errors.email = 'El correo electrónico es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'El formato del correo es inválido.';
    }

    if (!password) {
      errors.password = 'La contraseña es obligatoria.';
    } else if (password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres.';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await register({
        nombre,
        apellido,
        email,
        password,
        rol,
      });

      setSuccessMsg('¡Usuario registrado con éxito! Redirigiendo al inicio de sesión...');
      
      // Limpiar campos
      setNombre('');
      setApellido('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      // Redirigir después de 2.5 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      console.error(err);
      const apiMessage = err.response?.data?.message || 'Ocurrió un error al procesar el registro.';
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
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Únete hoy
            </span>
            <h1 className="text-4xl xl:text-5xl font-display font-bold leading-tight tracking-tight">
              Crea tu cuenta y únete a la comunidad de COTAL.
            </h1>
            <p className="text-indigo-200 text-base leading-relaxed">
              Encuentra oportunidades de trabajo, conecta con profesionales de confianza de tu zona local y potencia tus proyectos.
            </p>
          </div>

          {/* Tarjetas flotantes premium */}
          <div className="space-y-4 pt-4 text-slate-900">
            {/* Tarjeta 1 */}
            <div className="glass p-5 rounded-2xl border border-white/10 shadow-premium flex items-center gap-4 hover:translate-x-2 transition-transform duration-300">
              <div className="p-3 bg-emerald-500/10 text-emerald-700 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 text-sm">Proyecto completado</h4>
                <p className="text-xs text-slate-500 mt-0.5">Renovación eléctrica residencial - Por Mateo S.</p>
                <span className="text-[10px] inline-block mt-2 bg-emerald-500/10 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                  ★ 5.0 Excelente
                </span>
              </div>
            </div>

            {/* Tarjeta 2 */}
            <div className="glass p-5 rounded-2xl border border-white/10 shadow-premium flex items-center gap-4 hover:translate-x-2 transition-transform duration-300 delay-100">
              <div className="p-3 bg-indigo-500/10 text-indigo-700 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 text-sm">Comunidad en crecimiento</h4>
                <p className="text-xs text-slate-500 mt-0.5">Conéctate con cientos de profesionales y clientes cerca de ti.</p>
                <span className="text-[10px] inline-block mt-2 bg-indigo-500/10 text-indigo-700 px-2 py-0.5 rounded-full font-semibold">
                  +1,200 Activos
                </span>
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
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 md:p-16 relative bg-slate-50">
        {/* Fondo decorativo móvil */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-indigo-50/20 via-slate-50 to-indigo-50/20 pointer-events-none lg:hidden" />
        
        <div className="w-full max-w-lg relative z-10 space-y-6 animate-fadeIn py-8">
          {/* Logo móvil */}
          <div className="lg:hidden text-center flex flex-col items-center mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-700 flex items-center justify-center text-white font-display font-bold text-2xl shadow-premium mb-3">
              C
            </div>
            <h1 className="text-2xl font-display font-bold text-slate-900">COTAL</h1>
          </div>

          <div className="text-left">
            <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
              Crea tu cuenta
            </h2>
            <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
              Únete a COTAL y conecta con el talento de tu zona local.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-premium hover:shadow-premium-hover transition-all duration-300">
            {errorMsg && (
              <div className="mb-5 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-700 text-xs flex items-start gap-3 animate-fadeIn">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="font-medium">{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-5 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 text-xs flex items-start gap-3 animate-fadeIn">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Fila Nombre y Apellido */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Nombre
                  </label>
                  <input
                    type="text"
                    placeholder="Juan"
                    value={nombre}
                    onChange={(e) => {
                      setNombre(e.target.value);
                      if (validationErrors.nombre) setValidationErrors(prev => ({ ...prev, nombre: '' }));
                    }}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl text-sm focus:outline-none focus:ring-4 transition-all ${
                      validationErrors.nombre
                        ? 'border-rose-300 focus:ring-rose-100 focus:bg-white text-rose-950 placeholder-rose-300'
                        : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 focus:bg-white text-slate-900'
                    }`}
                  />
                  {validationErrors.nombre && (
                    <p className="mt-1 text-2xs text-rose-500 font-semibold flex items-center gap-1 animate-slideIn">
                      <span className="w-1 h-1 rounded-full bg-rose-500" />
                      {validationErrors.nombre}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Apellido
                  </label>
                  <input
                    type="text"
                    placeholder="Pérez"
                    value={apellido}
                    onChange={(e) => {
                      setApellido(e.target.value);
                      if (validationErrors.apellido) setValidationErrors(prev => ({ ...prev, apellido: '' }));
                    }}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl text-sm focus:outline-none focus:ring-4 transition-all ${
                      validationErrors.apellido
                        ? 'border-rose-300 focus:ring-rose-100 focus:bg-white text-rose-950 placeholder-rose-300'
                        : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 focus:bg-white text-slate-900'
                    }`}
                  />
                  {validationErrors.apellido && (
                    <p className="mt-1 text-2xs text-rose-500 font-semibold flex items-center gap-1 animate-slideIn">
                      <span className="w-1 h-1 rounded-full bg-rose-500" />
                      {validationErrors.apellido}
                    </p>
                  )}
                </div>
              </div>

              {/* Input Correo */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    placeholder="juan@ejemplo.com"
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

              {/* Fila Contraseñas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    placeholder="Mín. 6 caracteres"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (validationErrors.password) setValidationErrors(prev => ({ ...prev, password: '' }));
                    }}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl text-sm focus:outline-none focus:ring-4 transition-all ${
                      validationErrors.password
                        ? 'border-rose-300 focus:ring-rose-100 focus:bg-white text-rose-950 placeholder-rose-300'
                        : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 focus:bg-white text-slate-900'
                    }`}
                  />
                  {validationErrors.password && (
                    <p className="mt-1 text-2xs text-rose-500 font-semibold flex items-center gap-1 animate-slideIn">
                      <span className="w-1 h-1 rounded-full bg-rose-500" />
                      {validationErrors.password}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Confirmar
                  </label>
                  <input
                    type="password"
                    placeholder="Repite la clave"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (validationErrors.confirmPassword) setValidationErrors(prev => ({ ...prev, confirmPassword: '' }));
                    }}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl text-sm focus:outline-none focus:ring-4 transition-all ${
                      validationErrors.confirmPassword
                        ? 'border-rose-300 focus:ring-rose-100 focus:bg-white text-rose-950 placeholder-rose-300'
                        : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 focus:bg-white text-slate-900'
                    }`}
                  />
                  {validationErrors.confirmPassword && (
                    <p className="mt-1 text-2xs text-rose-500 font-semibold flex items-center gap-1 animate-slideIn">
                      <span className="w-1 h-1 rounded-full bg-rose-500" />
                      {validationErrors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* Selector de Rol */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Rol del Usuario
                </label>
                <div className="relative">
                  <select
                    value={rol}
                    onChange={(e) => setRol(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:bg-white rounded-2xl text-sm focus:outline-none transition-all cursor-pointer appearance-none text-slate-800 font-medium"
                  >
                    <option value="USER">Usuario regular (Talento buscador)</option>
                    <option value="HOST">Anfitrión local (Buscador de talentos)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal">
                  * El rol determina tus permisos en la plataforma.
                </p>
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
                    <span>Registrando...</span>
                  </div>
                ) : (
                  'Registrarse'
                )}
              </button>
            </form>
          </div>

          {/* Enlace de Login */}
          <p className="text-center text-sm text-slate-500">
            ¿Ya tienes una cuenta?{' '}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-all"
            >
              Inicia Sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
