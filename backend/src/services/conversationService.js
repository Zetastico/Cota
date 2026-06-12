import prisma from '../config/db.js';
import CustomError from '../utils/customError.js';

/**
 * Obtener o crear la conversación asociada a una solicitud ACCEPTED.
 * Solo puede hacerlo el USER dueño de la solicitud o el HOST dueño del servicio.
 */
const getOrCreateConversation = async (requestId, requestingUserId, requestingRole) => {
  const request = await prisma.serviceRequest.findUnique({
    where: { id: requestId },
    include: { service: { select: { ownerId: true } } },
  });

  if (!request) {
    throw new CustomError('Solicitud no encontrada.', 404, 'NotFoundError');
  }

  if (request.status !== 'ACCEPTED') {
    throw new CustomError(
      'Solo se puede abrir el chat en solicitudes aceptadas.',
      400,
      'BadRequestError'
    );
  }

  // Verificar que el solicitante sea participante
  const isUser = requestingRole === 'USER' && request.userId === requestingUserId;
  const isHost = requestingRole === 'HOST' && request.service.ownerId === requestingUserId;
  if (!isUser && !isHost) {
    throw new CustomError('No tienes acceso a esta conversación.', 403, 'ForbiddenError');
  }

  // Buscar o crear conversación
  let conversation = await prisma.conversation.findUnique({
    where: { requestId },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        requestId,
        userId: request.userId,
      },
    });
  }

  return conversation;
};

/**
 * Listar conversaciones del usuario autenticado (con último mensaje)
 */
const getMyConversations = async (userId, role) => {
  let where = {};

  if (role === 'USER') {
    where = { userId };
  } else if (role === 'HOST') {
    where = {
      request: {
        service: { ownerId: userId },
      },
    };
  }

  const conversations = await prisma.conversation.findMany({
    where,
    include: {
      request: {
        select: {
          id: true,
          status: true,
          service: {
            select: {
              id: true,
              title: true,
              category: true,
              owner: {
                select: { id: true, nombre: true, apellido: true },
              },
            },
          },
          user: {
            select: { id: true, nombre: true, apellido: true },
          },
        },
      },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: {
          id: true,
          body: true,
          senderRole: true,
          readAt: true,
          createdAt: true,
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return conversations;
};

export default {
  getOrCreateConversation,
  getMyConversations,
};
