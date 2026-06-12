import api from './api.js';

/**
 * Crear calificación para una solicitud aceptada
 * @param {Object} reviewData - { requestId, rating, comment }
 */
const createReview = async (reviewData) => {
  const response = await api.post('/api/reviews', reviewData);
  return response.data;
};

/**
 * Obtener calificaciones de un HOST
 * @param {string} hostId
 */
const getHostReviews = async (hostId) => {
  const response = await api.get(`/api/reviews/host/${hostId}`);
  return response.data;
};

export default {
  createReview,
  getHostReviews,
};
