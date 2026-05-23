import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config.js';
import CustomError from '../utils/customError.js';
import prisma from '../config/db.js';

/**
 * Middleware para proteger rutas exigiendo un token JWT válido
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // Verificar si el token viene en la cabecera Authorization
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new CustomError(
        'Acceso denegado. No se proporcionó un token de autenticación.',
        401,
        'UnauthorizedError'
      );
    }

    // Verificar el token con la clave secreta
    const decoded = jwt.verify(token, JWT_SECRET);

    // Buscar al usuario en la base de datos para confirmar que todavía existe
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        rol: true,
      },
    });

    if (!user) {
      throw new CustomError(
        'Acceso denegado. El usuario asociado al token ya no existe en el sistema.',
        401,
        'UnauthorizedError'
      );
    }

    // Inyectar el usuario en la solicitud
    req.user = user;
    next();
  } catch (error) {
    // Pasar errores del JWT (expirado, inválido) al errorHandler global
    next(error);
  }
};

/**
 * Middleware para restringir rutas a roles específicos
 * @param {...string} roles - Roles permitidos para acceder al endpoint
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new CustomError(
          'Error interno. Se intentó verificar el rol del usuario sin autenticar la ruta primero.',
          500,
          'InternalServerError'
        )
      );
    }

    if (!roles.includes(req.user.rol)) {
      return next(
        new CustomError(
          `No autorizado. Su rol (${req.user.rol}) no tiene permisos para acceder a este recurso.`,
          403,
          'ForbiddenError'
        )
      );
    }

    next();
  };
};
