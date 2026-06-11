import api from './api.js';

/**
 * Obtener estadísticas de dashboard dinámicas para el usuario autenticado
 * @returns {Promise<Object>} Datos de estadísticas y gráficos por rol
 */
const getDashboardStats = async () => {
  const response = await api.get('/api/stats/dashboard');
  return response.data; // Retorna { success: true, data: { role, stats, charts } }
};

export default {
  getDashboardStats,
};
