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

const getPublicServices = async (filters = {}) => {
  const { search, category, sort, page = 1, limit = 10 } = filters;

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skip = (pageNum - 1) * limitNum;

  const where = {
    status: 'APPROVED',
  };

  if (category && category !== 'Todas') {
    where.category = {
      equals: category,
      mode: 'insensitive',
    };
  }

  if (search) {
    where.OR = [
      {
        title: {
          contains: search,
          mode: 'insensitive',
        },
      },
      {
        description: {
          contains: search,
          mode: 'insensitive',
        },
      },
    ];
  }

  let orderBy = {
    createdAt: 'desc',
  };

  if (sort === 'price_asc') {
    orderBy = {
      price: 'asc',
    };
  } else if (sort === 'price_desc') {
    orderBy = {
      price: 'desc',
    };
  } else if (sort === 'recent') {
    orderBy = {
      createdAt: 'desc',
    };
  }

  const [total, rawServices] = await Promise.all([
    prisma.service.count({ where }),
    prisma.service.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
            rol: true,
            // Reviews recibidas por el HOST
            reviewsReceived: {
              select: {
                rating: true,
              },
            },
          },
        },
      },
      orderBy,
      skip,
      take: limitNum,
    }),
  ]);

  // Calcular calificaciones promedio del HOST para cada servicio
  const data = rawServices.map((service) => {
    const reviews = service.owner?.reviewsReceived || [];
    const hostReviewsCount = reviews.length;
    const hostAverageRating =
      hostReviewsCount > 0
        ? parseFloat((reviews.reduce((sum, r) => sum + r.rating, 0) / hostReviewsCount).toFixed(1))
        : 0;

    // Quitar array de reviewsReceived para evitar exponer datos redundantes
    const { reviewsReceived, ...ownerData } = service.owner;

    return {
      ...service,
      owner: ownerData,
      hostReviewsCount,
      hostAverageRating,
    };
  });

  return {
    data,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
    },
  };
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