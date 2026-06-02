import prisma from '../config/db.js';
import CustomError from '../utils/customError.js';

const getAllServices = async () => {
  return await prisma.service.findMany({
    include: {
      owner: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
          email: true,
          rol: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

const getServiceById = async (id) => {
  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      owner: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
          email: true,
          rol: true,
        },
      },
    },
  });

  if (!service) {
    throw new CustomError(
      'El servicio solicitado no existe.',
      404,
      'NotFoundError'
    );
  }

  return service;
};

const createService = async (data, ownerId) => {
  return await prisma.service.create({
    data: {
      title: data.title,
      description: data.description,
      price: data.price,
      category: data.category,
      ownerId,
      status: 'PENDING',
    },
  });
};

const updateService = async (id, data) => {
  const existing = await prisma.service.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new CustomError(
      'El servicio no existe.',
      404,
      'NotFoundError'
    );
  }

  const resetStatus =
    data.title ||
    data.description ||
    data.category ||
    data.price;

  return await prisma.service.update({
    where: { id },
    data: {
      ...data,
      ...(resetStatus && { status: 'PENDING' }),
    },
  });
};

const deleteService = async (id) => {
  const existing = await prisma.service.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new CustomError(
      'El servicio no existe.',
      404,
      'NotFoundError'
    );
  }

  await prisma.service.delete({
    where: { id },
  });

  return {
    message: 'Servicio eliminado exitosamente.',
  };
};

const approveService = async (id) => {
  return await prisma.service.update({
    where: { id },
    data: {
      status: 'APPROVED',
    },
  });
};

const rejectService = async (id) => {
  return await prisma.service.update({
    where: { id },
    data: {
      status: 'REJECTED',
    },
  });
};

const getPublicServices = async () => {
  return await prisma.service.findMany({
    where: {
      status: 'APPROVED',
    },
    include: {
      owner: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
          email: true,
          rol: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

const getMyServices = async (ownerId) => {
  return await prisma.service.findMany({
    where: {
      ownerId,
    },
    include: {
      owner: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
          email: true,
          rol: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

const getPendingServices = async () => {
  return await prisma.service.findMany({
    where: {
      status: 'PENDING',
    },
    include: {
      owner: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
          email: true,
          rol: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export default {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  approveService,
  rejectService,
  getPublicServices,
  getMyServices,
  getPendingServices,
};