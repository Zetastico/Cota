import dotenv from 'dotenv';

// Cargar variables de entorno desde el archivo .env
dotenv.config();

export const PORT = process.env.PORT || 3000;
export const DATABASE_URL = process.env.DATABASE_URL;
export const JWT_SECRET = process.env.JWT_SECRET || 'cotal_secreto_super_seguro_2026';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
export const BCRYPT_SALT_ROUNDS = 10;

// Validar variables críticas en producción o desarrollo
if (!process.env.DATABASE_URL) {
  console.warn('ADVERTENCIA: La variable DATABASE_URL no está definida en el entorno.');
}
