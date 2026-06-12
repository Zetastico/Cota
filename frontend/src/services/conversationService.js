import api from './api.js';

/**
 * Listar todas las conversaciones del usuario autenticado
 */
export const getMyConversations = async () => {
  const { data } = await api.get('/api/conversations');
  return data.conversations;
};

/**
 * Abrir (o crear) la conversación de una solicitud ACCEPTED
 */
export const openConversationFromRequest = async (requestId) => {
  const { data } = await api.post(`/api/conversations/from-request/${requestId}`);
  return data.conversation;
};

/**
 * Obtener mensajes de una conversación
 */
export const getMessages = async (conversationId, page = 1, limit = 50) => {
  const { data } = await api.get(`/api/conversations/${conversationId}/messages`, {
    params: { page, limit },
  });
  return data.messages;
};

/**
 * Enviar un mensaje a una conversación
 */
export const sendMessage = async (conversationId, body) => {
  const { data } = await api.post(`/api/conversations/${conversationId}/messages`, { body });
  return data.message;
};

/**
 * Obtener el conteo de mensajes no leídos
 */
export const getUnreadCount = async () => {
  const { data } = await api.get('/api/conversations/unread-count');
  return data.count;
};

const conversationService = {
  getMyConversations,
  openConversationFromRequest,
  getMessages,
  sendMessage,
  getUnreadCount,
};

export default conversationService;
