import prisma from '../config/db.js';
import CustomError from '../utils/customError.js';

/**
 * Validar que el usuario autenticado sea participante de la conversación
 */
const assertParticipant = async (conversationId, userId, role) => {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      request: {
        select: {
          userId: true,
          service: { select: { ownerId: true } },
        },
      },
    },
  });

  if (!conversation) {
    throw new CustomError('Conversación no encontrada.', 404, 'NotFoundError');
  }

  const isUser = role === 'USER' && conversation.request.userId === userId;
  const isHost = role === 'HOST' && conversation.request.service.ownerId === userId;

  if (!isUser && !isHost) {
    throw new CustomError('No tienes acceso a esta conversación.', 403, 'ForbiddenError');
  }

  return conversation;
};

/**
 * Obtener mensajes de una conversación (paginados)
 */
const getMessages = async (conversationId, userId, role, page = 1, limit = 50) => {
  await assertParticipant(conversationId, userId, role);

  const skip = (page - 1) * limit;

  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
    skip,
    take: limit,
  });

  // Marcar como leídos los mensajes enviados por la otra parte
  const unreadIds = messages
    .filter((m) => m.senderId !== userId && m.readAt === null)
    .map((m) => m.id);

  if (unreadIds.length > 0) {
    await prisma.message.updateMany({
      where: { id: { in: unreadIds } },
      data: { readAt: new Date() },
    });
  }

  return messages;
};

/**
 * Enviar un mensaje a una conversación
 */
const sendMessage = async (conversationId, senderId, senderRole, body) => {
  await assertParticipant(conversationId, senderId, senderRole);

  if (!body || body.trim() === '') {
    throw new CustomError('El mensaje no puede estar vacío.', 400, 'BadRequestError');
  }

  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId,
      senderRole,
      body: body.trim(),
    },
  });

  // Actualizar el updatedAt de la conversación para ordenar la lista
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  return message;
};

/**
 * Contar mensajes no leídos del usuario autenticado
 */
const getUnreadCount = async (userId, role) => {
  let conversationFilter = {};
  if (role === 'USER') {
    conversationFilter = { userId };
  } else if (role === 'HOST') {
    conversationFilter = { request: { service: { ownerId: userId } } };
  }

  const conversations = await prisma.conversation.findMany({
    where: conversationFilter,
    select: { id: true },
  });
  const conversationIds = conversations.map((c) => c.id);

  const count = await prisma.message.count({
    where: {
      conversationId: { in: conversationIds },
      senderId: { not: userId },
      readAt: null,
    },
  });

  return count;
};

export default {
  getMessages,
  sendMessage,
  getUnreadCount,
};
