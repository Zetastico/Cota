import CustomError from '../utils/customError.js';

/**
 * Middleware para capturar solicitudes a rutas no existentes
 */
export const notFoundHandler = (req, res, next) => {
  const error = new CustomError(
    `La ruta ${req.originalUrl} con el método ${req.method} no existe en este servidor.`,
    404,
    'RouteNotFoundError'
  );
  next(error);
};
