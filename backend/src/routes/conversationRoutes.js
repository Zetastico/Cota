import express from 'express';
import {
  listConversations,
  openFromRequest,
  getMessages,
  sendMessage,
  getUnreadCount,
} from '../controllers/conversationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

// GET /api/conversations/unread-count
router.get('/unread-count', getUnreadCount);

// GET /api/conversations  — listar mis conversaciones
router.get('/', listConversations);

// POST /api/conversations/from-request/:requestId — abrir/crear desde solicitud
router.post('/from-request/:requestId', openFromRequest);

// GET /api/conversations/:id/messages — obtener mensajes
router.get('/:id/messages', getMessages);

// POST /api/conversations/:id/messages — enviar mensaje
router.post('/:id/messages', sendMessage);

export default router;
