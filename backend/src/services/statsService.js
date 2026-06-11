import prisma from '../config/db.js';

/**
 * Obtener estadísticas adaptadas al rol del usuario autenticado
 * @param {Object} user - Usuario autenticado
 */
const getDashboardStats = async (user) => {
  const { id: userId, rol: role } = user;

  if (role === 'ADMIN') {
    // 1. Total de usuarios
    const totalUsers = await prisma.user.count();

    // 2. Usuarios por rol
    const usersByRoleRaw = await prisma.user.groupBy({
      by: ['rol'],
      _count: { id: true },
    });
    const usersByRole = usersByRoleRaw.map(u => ({
      name: u.rol,
      value: u._count.id,
    }));

    // 3. Total de servicios y desglose por estado
    const totalServices = await prisma.service.count();
    const servicesByStatusRaw = await prisma.service.groupBy({
      by: ['status'],
      _count: { id: true },
    });
    const servicesByStatusMap = servicesByStatusRaw.reduce((acc, curr) => {
      acc[curr.status] = curr._count.id;
      return acc;
    }, {});
    const pendingServices = servicesByStatusMap['PENDING'] || 0;
    const approvedServices = servicesByStatusMap['APPROVED'] || 0;
    const rejectedServices = servicesByStatusMap['REJECTED'] || 0;

    const servicesByStatus = [
      { name: 'Pendientes', value: pendingServices },
      { name: 'Aprobados', value: approvedServices },
      { name: 'Rechazados', value: rejectedServices },
    ];

    // 4. Total de solicitudes y desglose por estado
    const totalRequests = await prisma.serviceRequest.count();
    const requestsByStatusRaw = await prisma.serviceRequest.groupBy({
      by: ['status'],
      _count: { id: true },
    });
    const requestsByStatusMap = requestsByStatusRaw.reduce((acc, curr) => {
      acc[curr.status] = curr._count.id;
      return acc;
    }, {});
    const pendingRequests = requestsByStatusMap['PENDING'] || 0;
    const acceptedRequests = requestsByStatusMap['ACCEPTED'] || 0;
    const rejectedRequests = requestsByStatusMap['REJECTED'] || 0;

    const requestsByStatus = [
      { name: 'Pendientes', value: pendingRequests },
      { name: 'Aceptadas', value: acceptedRequests },
      { name: 'Rechazadas', value: rejectedRequests },
    ];

    return {
      role: 'ADMIN',
      stats: {
        totalUsers,
        totalServices,
        pendingServices,
        approvedServices,
        rejectedServices,
        totalRequests,
        pendingRequests,
        acceptedRequests,
        rejectedRequests,
      },
      charts: {
        servicesByStatus,
        usersByRole,
        requestsByStatus,
      },
    };
  } else if (role === 'HOST') {
    // 1. Total de servicios publicados por el HOST y desglose por estado
    const totalServices = await prisma.service.count({
      where: { ownerId: userId },
    });

    const servicesByStatusRaw = await prisma.service.groupBy({
      where: { ownerId: userId },
      by: ['status'],
      _count: { id: true },
    });
    const servicesByStatusMap = servicesByStatusRaw.reduce((acc, curr) => {
      acc[curr.status] = curr._count.id;
      return acc;
    }, {});
    const pendingServices = servicesByStatusMap['PENDING'] || 0;
    const approvedServices = servicesByStatusMap['APPROVED'] || 0;
    const rejectedServices = servicesByStatusMap['REJECTED'] || 0;

    const servicesByStatus = [
      { name: 'Pendientes', value: pendingServices },
      { name: 'Aprobados', value: approvedServices },
      { name: 'Rechazados', value: rejectedServices },
    ];

    // 2. Solicitudes recibidas y desglose por estado
    const totalRequestsReceived = await prisma.serviceRequest.count({
      where: {
        service: { ownerId: userId },
      },
    });

    const requestsByStatusRaw = await prisma.serviceRequest.groupBy({
      where: {
        service: { ownerId: userId },
      },
      by: ['status'],
      _count: { id: true },
    });
    const requestsByStatusMap = requestsByStatusRaw.reduce((acc, curr) => {
      acc[curr.status] = curr._count.id;
      return acc;
    }, {});
    const pendingRequestsReceived = requestsByStatusMap['PENDING'] || 0;
    const acceptedRequestsReceived = requestsByStatusMap['ACCEPTED'] || 0;
    const rejectedRequestsReceived = requestsByStatusMap['REJECTED'] || 0;

    const requestsReceivedByStatus = [
      { name: 'Pendientes', value: pendingRequestsReceived },
      { name: 'Aceptadas', value: acceptedRequestsReceived },
      { name: 'Rechazadas', value: rejectedRequestsReceived },
    ];

    return {
      role: 'HOST',
      stats: {
        totalServices,
        pendingServices,
        approvedServices,
        rejectedServices,
        totalRequestsReceived,
        pendingRequestsReceived,
        acceptedRequestsReceived,
        rejectedRequestsReceived,
      },
      charts: {
        servicesByStatus,
        requestsReceivedByStatus,
      },
    };
  } else if (role === 'USER') {
    // 1. Total de solicitudes realizadas y desglose por estado
    const totalRequests = await prisma.serviceRequest.count({
      where: { userId },
    });

    const requestsByStatusRaw = await prisma.serviceRequest.groupBy({
      where: { userId },
      by: ['status'],
      _count: { id: true },
    });
    const requestsByStatusMap = requestsByStatusRaw.reduce((acc, curr) => {
      acc[curr.status] = curr._count.id;
      return acc;
    }, {});
    const pendingRequests = requestsByStatusMap['PENDING'] || 0;
    const acceptedRequests = requestsByStatusMap['ACCEPTED'] || 0;
    const rejectedRequests = requestsByStatusMap['REJECTED'] || 0;

    const requestsByStatus = [
      { name: 'Pendientes', value: pendingRequests },
      { name: 'Aceptadas', value: acceptedRequests },
      { name: 'Rechazadas', value: rejectedRequests },
    ];

    // 2. Servicios disponibles para explorar (aprobados)
    const totalServicesAvailable = await prisma.service.count({
      where: { status: 'APPROVED' },
    });

    return {
      role: 'USER',
      stats: {
        totalRequests,
        pendingRequests,
        acceptedRequests,
        rejectedRequests,
        totalServicesAvailable,
      },
      charts: {
        requestsByStatus,
      },
    };
  }

  throw new Error('Rol de usuario no válido para estadísticas.');
};

export default {
  getDashboardStats,
};
