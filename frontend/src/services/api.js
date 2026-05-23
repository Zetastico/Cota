import axios from 'axios';

// Crear una instancia de Axios con la URL base del backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de solicitudes: adjunta automáticamente el token JWT
 * de localStorage a las cabeceras de cada petición HTTP.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de respuestas: captura errores globales. Si la respuesta
 * es 401 (No autorizado), limpia la sesión e indica la expiración al sistema.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Capturar error 401 (Sesión expirada o token inválido)
    if (error.response && error.response.status === 401) {
      // Limpiar datos obsoletos de sesión
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Emitir un evento global para que AuthContext actualice su estado
      window.dispatchEvent(new Event('cotal-auth-expired'));
    }
    return Promise.reject(error);
  }
);

export default api;
