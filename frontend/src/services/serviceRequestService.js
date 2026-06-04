import api from './api.js';

/**
 * Crear una nueva solicitud de servicio (USER)
 * @param {Object} requestData - { serviceId, message, contactPhone, desiredDate }
 */
const createRequest = async (requestData) => {
  const response = await api.post('/api/service-requests', requestData);
  return response.data;
};

/**
 * Obtener solicitudes de servicios recibidas por el HOST autenticado
 */
const getMyServiceRequests = async () => {
  const response = await api.get('/api/service-requests/my-services');
  return response.data;
};

/**
 * Aceptar una solicitud de servicio (HOST)
 * @param {string} id - UUID de la solicitud
 */
const acceptRequest = async (id) => {
  const response = await api.patch(`/api/service-requests/${id}/accept`);
  return response.data;
};

/**
 * Rechazar una solicitud de servicio (HOST)
 * @param {string} id - UUID de la solicitud
 */
const rejectRequest = async (id) => {
  const response = await api.patch(`/api/service-requests/${id}/reject`);
  return response.data;
};

/**
 * Obtener solicitudes realizadas por el USER autenticado
 */
const getMyRequests = async () => {
  const response = await api.get('/api/service-requests/my-requests');
  return response.data;
};

export default {
  createRequest,
  getMyServiceRequests,
  acceptRequest,
  rejectRequest,
  getMyRequests,
};
