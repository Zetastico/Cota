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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-100 via-slate-50 to-indigo-50/30 px-4 py-12">
      <div className="max-w-lg w-full">
        {/* Encabezado */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-md mx-auto mb-4">
            C
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
            Crea tu cuenta
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Únete a COTAL y conecta con el talento de tu zona local
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

          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600 text-xs flex items-start gap-2.5 animate-fadeIn">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Fila Nombre y Apellido */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wider">
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
                  className={`w-full px-4 py-2 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                    validationErrors.nombre ? 'border-rose-300 focus:ring-rose-100 text-rose-900' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
                {validationErrors.nombre && (
                  <p className="mt-1 text-2xs text-rose-500 font-medium">{validationErrors.nombre}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wider">
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
                  className={`w-full px-4 py-2 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                    validationErrors.apellido ? 'border-rose-300 focus:ring-rose-100 text-rose-900' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
                {validationErrors.apellido && (
                  <p className="mt-1 text-2xs text-rose-500 font-medium">{validationErrors.apellido}</p>
                )}
              </div>
            </div>

            {/* Input Correo */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wider">
                Correo Electrónico
              </label>
              <input
                type="email"
                placeholder="juan@ejemplo.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (validationErrors.email) setValidationErrors(prev => ({ ...prev, email: '' }));
                }}
                disabled={isSubmitting}
                className={`w-full px-4 py-2 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                  validationErrors.email ? 'border-rose-300 focus:ring-rose-100 text-rose-900' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                }`}
              />
              {validationErrors.email && (
                <p className="mt-1 text-2xs text-rose-500 font-medium">{validationErrors.email}</p>
              )}
            </div>

            {/* Fila Contraseñas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wider">
                  Contraseña
                </label>
                <input
                  type="password"
                  placeholder="Min. 6 caracteres"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (validationErrors.password) setValidationErrors(prev => ({ ...prev, password: '' }));
                  }}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                    validationErrors.password ? 'border-rose-300 focus:ring-rose-100 text-rose-900' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
                {validationErrors.password && (
                  <p className="mt-1 text-2xs text-rose-500 font-medium">{validationErrors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wider">
                  Confirmar Contraseña
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
                  className={`w-full px-4 py-2 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                    validationErrors.confirmPassword ? 'border-rose-300 focus:ring-rose-100 text-rose-900' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
                {validationErrors.confirmPassword && (
                  <p className="mt-1 text-2xs text-rose-500 font-medium">{validationErrors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Selector de Rol */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wider">
                Rol del Usuario
              </label>
              <select
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:bg-white rounded-xl text-sm focus:outline-none transition-all cursor-pointer"
              >
                <option value="USER">Usuario regular (Talento buscador)</option>
                <option value="HOST">Anfitrión local (Buscador de talentos)</option>
              </select>
              <p className="mt-1.5 text-3xs text-slate-400 leading-normal">
                * El rol determina tus capacidades básicas dentro de la plataforma COTAL. El rol de ADMIN solo se asigna de manera privada.
              </p>
            </div>

            {/* Botón de Enviar */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full flex items-center justify-center py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow active:scale-98"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Registrando datos en COTAL...</span>
                </div>
              ) : (
                'Registrarse'
              )}
            </button>
          </form>
        </div>

        {/* Enlace de Login */}
        <p className="mt-6 text-center text-sm text-slate-500">
          ¿Ya tienes una cuenta?{' '}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            Inicia Sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
