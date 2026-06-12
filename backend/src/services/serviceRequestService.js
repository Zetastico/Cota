import prisma from '../config/db.js';
import CustomError from '../utils/customError.js';

/**
 * Crear una nueva solicitud de servicio
 */
const createRequest = async (data, userId) => {
  const { serviceId, message, contactPhone, desiredDate } = data;

  // 1. Validar que el servicio exista
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
  });

  if (!service) {
    throw new CustomError('El servicio solicitado no existe.', 404, 'NotFoundError');
  }

  // 2. No permitir solicitudes sobre servicios no aprobados
  if (service.status !== 'APPROVED') {
    throw new CustomError(
      'No se pueden enviar solicitudes para servicios que no estén aprobados.',
      400,
      'BadRequestError'
    );
  }

  // 3. No permitir que un HOST solicite sus propios servicios
  if (service.ownerId === userId) {
    throw new CustomError(
      'No puedes solicitar tu propio servicio.',
      400,
      'BadRequestError'
    );
  }

  // 4. Validar fecha deseada (debe ser a futuro)
  const parsedDate = new Date(desiredDate);
  if (isNaN(parsedDate.getTime()) || parsedDate < new Date()) {
    throw new CustomError(
      'La fecha deseada debe ser una fecha válida en el futuro.',
      400,
      'BadRequestError'
    );
  }

  // 5. Registrar la solicitud
  return await prisma.serviceRequest.create({
    data: {
      serviceId,
      userId,
      message,
      contactPhone,
      desiredDate: parsedDate,
      paymentMethod: data.paymentMethod || 'CASH',
      status: 'PENDING',
    },
    include: {
      service: true,
    },
  });
};

/**
 * Obtener solicitudes de servicios recibidas por el HOST
 */
const getMyServiceRequests = async (hostId) => {
  return await prisma.serviceRequest.findMany({
    where: {
      service: {
        ownerId: hostId,
      },
    },
    include: {
      service: {
        select: {
          id: true,
          title: true,
          price: true,
          category: true,
        },
      },
      user: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
          email: true,
        },
      },
      review: {
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

/**
 * Aceptar una solicitud de servicio
 */
const acceptRequest = async (id, hostId) => {
  const request = await prisma.serviceRequest.findUnique({
    where: { id },
    include: { service: true },
  });

  if (!request) {
    throw new CustomError('La solicitud especificada no existe.', 404, 'NotFoundError');
  }

  // Verificar propiedad
  if (request.service.ownerId !== hostId) {
    throw new CustomError(
      'No está autorizado para gestionar esta solicitud.',
      403,
      'ForbiddenError'
    );
  }

  return await prisma.serviceRequest.update({
    where: { id },
    data: { status: 'ACCEPTED' },
    include: {
      service: true,
      user: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
          email: true,
        },
      },
      review: {
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
        }
      }
    },
  });
};

/**
 * Rechazar una solicitud de servicio
 */
const rejectRequest = async (id, hostId) => {
  const request = await prisma.serviceRequest.findUnique({
    where: { id },
    include: { service: true },
  });

  if (!request) {
    throw new CustomError('La solicitud especificada no existe.', 404, 'NotFoundError');
  }

  // Verificar propiedad
  if (request.service.ownerId !== hostId) {
    throw new CustomError(
      'No está autorizado para gestionar esta solicitud.',
      403,
      'ForbiddenError'
    );
  }

  return await prisma.serviceRequest.update({
    where: { id },
    data: { status: 'REJECTED' },
    include: {
      service: true,
      user: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
          email: true,
        },
      },
      review: {
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
        }
      }
    },
  });
};

/**
 * Obtener solicitudes realizadas por el USER autenticado
 */
const getMyRequests = async (userId) => {
  return await prisma.serviceRequest.findMany({
    where: {
      userId,
    },
    include: {
      service: {
        select: {
          id: true,
          title: true,
          price: true,
          category: true,
          owner: {
            select: {
              id: true,
              nombre: true,
              apellido: true,
              email: true,
            },
          },
        },
      },
      review: {
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export default {
  createRequest,
  getMyServiceRequests,
  acceptRequest,
  rejectRequest,
  getMyRequests,
};
