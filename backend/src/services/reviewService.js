import prisma from '../config/db.js';
import CustomError from '../utils/customError.js';

/**
 * Crear calificación para una solicitud aceptada
 */
const createReview = async (data, userId) => {
  const { requestId, rating, comment } = data;

  // 1. Validar rating entre 1 y 5
  if (!rating || rating < 1 || rating > 5) {
    throw new CustomError('La calificación debe estar entre 1 y 5 estrellas.', 400, 'ValidationError');
  }

  // 2. Validar que la solicitud exista
  const request = await prisma.serviceRequest.findUnique({
    where: { id: requestId },
    include: {
      service: true,
      review: true,
    },
  });

  if (!request) {
    throw new CustomError('La solicitud especificada no existe.', 404, 'NotFoundError');
  }

  // 3. Validar que la solicitud pertenezca al USER autenticado
  if (request.userId !== userId) {
    throw new CustomError('No tienes permiso para calificar esta solicitud.', 403, 'ForbiddenError');
  }

  // 4. Validar que la solicitud esté ACCEPTED
  if (request.status !== 'ACCEPTED') {
    throw new CustomError('Solo se pueden calificar solicitudes aceptadas (ACCEPTED).', 400, 'BadRequestError');
  }

  // 5. Validar que no exista review previa para esa solicitud
  if (request.review) {
    throw new CustomError('Esta solicitud ya ha sido calificada.', 400, 'BadRequestError');
  }

  // 6. Obtener hostId y serviceId de la solicitud/servicio
  const { serviceId, service } = request;
  const hostId = service.ownerId;

  // Crear la review
  return await prisma.review.create({
    data: {
      rating: parseInt(rating, 10),
      comment,
      userId,
      hostId,
      serviceId,
      requestId,
    },
    include: {
      service: {
        select: {
          title: true,
        },
      },
      user: {
        select: {
          nombre: true,
          apellido: true,
        },
      },
    },
  });
};

/**
 * Obtener calificaciones de un HOST sin exponer información sensible
 */
const getHostReviews = async (hostId) => {
  return await prisma.review.findMany({
    where: { hostId },
    select: {
      id: true,
      rating: true,
      comment: true,
      createdAt: true,
      service: {
        select: {
          id: true,
          title: true,
          category: true,
        },
      },
      user: {
        select: {
          nombre: true,
          apellido: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export default {
  createReview,
  getHostReviews,
};
