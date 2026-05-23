import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import userService from '../services/userService.js';

/**
 * Página del CRUD de usuarios: Listado completo
 * Diseño tabular responsivo, búsqueda dinámica, y modal de eliminación
 */
const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Estados para Modal de Confirmación de Borrado
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await userService.getAllUsers();
      setUsers(response.data || []);
    } catch (err) {
      console.error(err);
      setErrorMsg('No se pudo obtener la lista de usuarios. Verifica la conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  // Abrir diálogo de borrado
  const confirmDelete = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  // Ejecutar eliminación
  const handleDelete = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await userService.deleteUser(userToDelete.id);
      setSuccessMsg(`Usuario ${userToDelete.nombre} eliminado con éxito.`);
      
      // Actualizar la lista en memoria eliminando el registro
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      
      // Cerrar modal
      setDeleteModalOpen(false);
      setUserToDelete(null);

      // Limpiar mensaje de éxito
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
      const apiMessage = err.response?.data?.message || 'No se pudo eliminar el usuario.';
      setErrorMsg(apiMessage);
      setDeleteModalOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  // Filtrado reactivo en base al buscador
  const filteredUsers = users.filter((u) => {
    const term = searchQuery.toLowerCase();
    return (
      u.nombre.toLowerCase().includes(term) ||
      u.apellido.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.rol.toLowerCase().includes(term)
    );
  });

  // Formateador de fecha
  const formatDate = (isoString) => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Colores del rol
  const renderRoleBadge = (role) => {
    const colors = {
      ADMIN: 'bg-indigo-50 text-indigo-700 border-indigo-150',
      HOST: 'bg-emerald-50 text-emerald-700 border-emerald-150',
      USER: 'bg-slate-100 text-slate-700 border-slate-200',
    };
    return (
      <span className={`px-2 py-0.5 text-2xs font-bold rounded-full border ${colors[role] || colors.USER}`}>
        {role}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Encabezado y botón Añadir */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Listado de Usuarios</h2>
          <p className="text-xs text-slate-500 mt-1">Gestión administrativa de los talentos y anfitriones de COTAL.</p>
        </div>
        <Link
          to="/users/create"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm hover:shadow active:scale-98 transition-all flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M12 4.5v15m7.5-7.5h-15"
              />
          </svg>
          <span>Nuevo Usuario</span>
        </Link>
      </div>

      {/* Alertas */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs flex items-start gap-2.5 animate-fadeIn">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600 text-xs flex items-start gap-2.5 animate-fadeIn">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{successMsg}</span>
        </div>
      )}

      {/* Controles de Búsqueda */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Buscar por nombre, email o rol..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 shadow-sm transition-all"
        />
      </div>

      {/* Tabla del CRUD */}
      <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-premium">
        {loading ? (
          <div className="p-12 text-center">
            <div className="relative w-10 h-10 mx-auto">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-slate-100 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-4 text-xs font-semibold text-slate-400 animate-pulse">Obteniendo datos...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <svg className="w-12 h-12 mx-auto text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-semibold">No se encontraron usuarios</p>
            <p className="text-xs text-slate-400 mt-1">Prueba redefiniendo tu búsqueda o crea un nuevo usuario.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-slate-600">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Usuario</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Rol</th>
                  <th className="px-6 py-4">Fecha de Alta</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Celda de Usuario */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs rounded-full">
                          {user.nombre[0]}
                          {user.apellido[0]}
                        </div>
                        <div className="font-semibold text-slate-800">
                          {user.nombre} {user.apellido}
                        </div>
                      </div>
                    </td>

                    {/* Celda de Email */}
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">
                      {user.email}
                    </td>

                    {/* Celda de Rol */}
                    <td className="px-6 py-4">
                      {renderRoleBadge(user.rol)}
                    </td>

                    {/* Celda de Fecha */}
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {formatDate(user.createdAt)}
                    </td>

                    {/* Celda de Acciones */}
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        to={`/users/${user.id}/edit`}
                        className="inline-flex p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all"
                        title="Editar usuario"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </Link>
                      
                      <button
                        onClick={() => confirmDelete(user)}
                        className="inline-flex p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all"
                        title="Eliminar usuario"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. MODAL DE CONFIRMACIÓN DE BORRADO */}
      {deleteModalOpen && userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-premium border border-slate-100 animate-scaleUp">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              ¿Confirmas la eliminación?
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Estás por eliminar físicamente la cuenta de{' '}
              <strong className="text-slate-800 font-semibold">
                {userToDelete.nombre} {userToDelete.apellido}
              </strong>{' '}
              ({userToDelete.email}). Esta acción es permanente y eliminará todos sus datos.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                disabled={deleting}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-500 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-all disabled:bg-rose-400 flex items-center gap-1.5"
              >
                {deleting ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Borrando...</span>
                  </>
                ) : (
                  'Eliminar Permanentemente'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
