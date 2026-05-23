import { PORT } from '../config/config.js';

/**
 * Middleware global de manejo de errores
 */
export const errorHandler = (err, req, res, next) => {
  // En desarrollo mostramos el log completo del error
  console.error(`[ERROR] ${err.name}: ${err.message}`);
  if (err.stack) {
    console.error(err.stack);
  }

  // 1. Manejo de errores conocidos de Prisma ORM
  if (err.code === 'P2002') {
    // Violación de restricción única (ej. email duplicado)
    const targetFields = err.meta?.target || [];
    return res.status(409).json({
      success: false,
      error: 'ConflictError',
      message: `El valor proporcionado para ${targetFields.join(', ')} ya está registrado en el sistema.`,
    });
  }

  if (err.code === 'P2025') {
    // Record not found
    return res.status(404).json({
      success: false,
      error: 'NotFoundError',
      message: err.meta?.cause || 'El recurso solicitado no fue encontrado en la base de datos.',
    });
  }

  if (err.code === 'P2003') {
    // Foreign key constraint failed
    return res.status(400).json({
      success: false,
      error: 'ValidationError',
      message: 'Fallo en la integridad de los datos (clave foránea inexistente).',
    });
  }

  // 2. Errores de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'UnauthorizedError',
      message: 'El token de autenticación proporcionado no es válido o ha expirado.',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'UnauthorizedError',
      message: 'El token de sesión ha expirado. Por favor, inicia sesión de nuevo.',
    });
  }

  // 3. Errores personalizados (CustomError)
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Ha ocurrido un error inesperado en el servidor.';
  const errorName = err.name && err.name !== 'Error' ? err.name : 'InternalServerError';

  res.status(statusCode).json({
    success: false,
    error: errorName,
    message,
    // Solo enviar el stack trace en entornos que no sean de producción si se requiere depuración
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
