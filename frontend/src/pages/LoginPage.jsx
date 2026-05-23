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
      await login(email, password);
      // Éxito: redireccionar al dashboard
      navigate('/dashboard');
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-100 via-slate-50 to-indigo-50/30 px-4">
      <div className="max-w-md w-full">
        {/* Logo y Encabezado */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-md mx-auto mb-4 active:scale-95 transition-all">
            C
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Bienvenido de nuevo
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Ingresa a tu cuenta de COTAL para gestionar tu talento local
          </p>
        </div>

        {/* Tarjeta de Formulario */}
        <div className="bg-white p-8 rounded-2xl border border-slate-150 shadow-premium">
          {errorMsg && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs flex items-start gap-2.5 animate-fadeIn">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                Correo Electrónico
              </label>
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
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                  validationErrors.email
                    ? 'border-rose-300 focus:ring-rose-200 focus:bg-white text-rose-900'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 focus:bg-white'
                }`}
              />
              {validationErrors.email && (
                <p className="mt-1 text-2xs text-rose-500 font-medium">{validationErrors.email}</p>
              )}
            </div>

            {/* Input Contraseña */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Contraseña
                </label>
              </div>
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
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                  validationErrors.password
                    ? 'border-rose-300 focus:ring-rose-200 focus:bg-white text-rose-900'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 focus:bg-white'
                }`}
              />
              {validationErrors.password && (
                <p className="mt-1 text-2xs text-rose-500 font-medium">{validationErrors.password}</p>
              )}
            </div>

            {/* Botón de Enviar */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow active:scale-98"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Verificando credenciales...</span>
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>
        </div>

        {/* Enlace de Registro */}
        <p className="mt-6 text-center text-sm text-slate-500">
          ¿No tienes una cuenta?{' '}
          <Link
            to="/register"
            className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
