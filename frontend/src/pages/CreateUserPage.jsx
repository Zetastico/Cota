import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import userService from '../services/userService.js';

/**
 * Vista de creación administrativa de usuarios
 * Estilo Notion/Stripe limpio y responsivo
 */
const CreateUserPage = () => {
  const navigate = useNavigate();

  // Estados del Formulario
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('USER');

  // Estados de control
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  // Validaciones del formulario local
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
      await userService.createUser({
        nombre,
        apellido,
        email,
        password,
        rol,
      });

      setSuccessMsg('Usuario creado exitosamente.');
      
      // Limpiar campos
      setNombre('');
      setApellido('');
      setEmail('');
      setPassword('');
      setRol('USER');

      // Redirigir al listado tras 1.5 segundos
      setTimeout(() => {
        navigate('/users');
      }, 1500);
    } catch (err) {
      console.error(err);
      const apiMessage = err.response?.data?.message || 'Error al guardar el usuario en el servidor.';
      setErrorMsg(apiMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fadeIn">
      {/* Botón de retorno y Encabezado */}
      <div className="space-y-3">
        <Link
          to="/users"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Volver al Listado</span>
        </Link>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Crear Nuevo Usuario</h2>
          <p className="text-xs text-slate-500 mt-1">Registra una nueva cuenta de forma directa en el sistema.</p>
        </div>
      </div>

      {/* Tarjeta de Formulario */}
      <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-premium">
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Fila Nombre y Apellido */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                Nombre
              </label>
              <input
                type="text"
                placeholder="Ej. Juan"
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  if (validationErrors.nombre) setValidationErrors(prev => ({ ...prev, nombre: '' }));
                }}
                disabled={isSubmitting}
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                  validationErrors.nombre ? 'border-rose-300 focus:ring-rose-100 text-rose-900' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                }`}
              />
              {validationErrors.nombre && (
                <p className="mt-1 text-2xs text-rose-500 font-medium">{validationErrors.nombre}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                Apellido
              </label>
              <input
                type="text"
                placeholder="Ej. Pérez"
                value={apellido}
                onChange={(e) => {
                  setApellido(e.target.value);
                  if (validationErrors.apellido) setValidationErrors(prev => ({ ...prev, apellido: '' }));
                }}
                disabled={isSubmitting}
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all ${
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
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Correo Electrónico
            </label>
            <input
              type="email"
              placeholder="juan@correo.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (validationErrors.email) setValidationErrors(prev => ({ ...prev, email: '' }));
              }}
              disabled={isSubmitting}
              className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                validationErrors.email ? 'border-rose-300 focus:ring-rose-100 text-rose-900' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />
            {validationErrors.email && (
              <p className="mt-1 text-2xs text-rose-500 font-medium">{validationErrors.email}</p>
            )}
          </div>

          {/* Input Contraseña */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="Establece una contraseña de al menos 6 caracteres"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (validationErrors.password) setValidationErrors(prev => ({ ...prev, password: '' }));
              }}
              disabled={isSubmitting}
              className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                validationErrors.password ? 'border-rose-300 focus:ring-rose-100 text-rose-900' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />
            {validationErrors.password && (
              <p className="mt-1 text-2xs text-rose-500 font-medium">{validationErrors.password}</p>
            )}
          </div>

          {/* Selector de Rol */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Asignar Rol
            </label>
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:bg-white rounded-xl text-sm focus:outline-none transition-all cursor-pointer font-medium"
            >
              <option value="USER">USER (Talento Local)</option>
              <option value="HOST">HOST (Anfitrión Local)</option>
              <option value="ADMIN">ADMIN (Administrador Global)</option>
            </select>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Link
              to="/users"
              className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-sm font-semibold text-slate-500 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center py-2.5 px-6 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all shadow-sm active:scale-98"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Guardando...</span>
                </div>
              ) : (
                'Crear Usuario'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserPage;
