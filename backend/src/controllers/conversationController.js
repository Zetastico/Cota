import conversationService from '../services/conversationService.js';
import messageService from '../services/messageService.js';

/**
 * GET /api/conversations
 * Lista las conversaciones del usuario autenticado
 */
export const listConversations = async (req, res, next) => {
  try {
    const conversations = await conversationService.getMyConversations(
      req.user.id,
      req.user.rol
    );
    res.json({ conversations });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/conversations/from-request/:requestId
 * Obtiene o crea la conversación ligada a una solicitud ACCEPTED
 */
export const openFromRequest = async (req, res, next) => {
  try {
    const conversation = await conversationService.getOrCreateConversation(
      req.params.requestId,
      req.user.id,
      req.user.rol
    );
    res.json({ conversation });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/conversations/:id/messages
 * Obtiene los mensajes de una conversación (con auto-mark-read)
 */
export const getMessages = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const messages = await messageService.getMessages(
      req.params.id,
      req.user.id,
      req.user.rol,
      page,
      limit
    );
    res.json({ messages });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/conversations/:id/messages
 * Envía un mensaje a una conversación
 */
export const sendMessage = async (req, res, next) => {
  try {
    const message = await messageService.sendMessage(
      req.params.id,
      req.user.id,
      req.user.rol,
      req.body.body
    );
    res.status(201).json({ message });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/conversations/unread-count
 * Retorna el número de mensajes no leídos del usuario autenticado
 */
export const getUnreadCount = async (req, res, next) => {
  try {
    const count = await messageService.getUnreadCount(req.user.id, req.user.rol);
    res.json({ count });
  } catch (err) {
    next(err);
  }
};
