import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/config.js';

/**
 * Genera un token JWT firmado con el ID del usuario
 * @param {string} id - ID del usuario (UUID)
 * @returns {string} Token JWT
 */
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export default generateToken;
