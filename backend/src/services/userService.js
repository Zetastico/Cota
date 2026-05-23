import prisma from '../config/db.js';
import bcrypt from 'bcrypt';
import { BCRYPT_SALT_ROUNDS } from '../config/config.js';
import CustomError from '../utils/customError.js';

/**
 * Obtener todos los usuarios registrados
 * Excluye la contraseña por motivos de seguridad
 */
const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      nombre: true,
      apellido: true,
      email: true,
      rol: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

/**
 * Obtener un usuario por su ID
 * Excluye la contraseña por motivos de seguridad
 */
const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      nombre: true,
      apellido: true,
      email: true,
      rol: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new CustomError('El usuario con el ID especificado no existe.', 404, 'NotFoundError');
  }

  return user;
};

/**
 * Obtener un usuario por su email
 * Utilidad interna, incluye el password para comprobación de autenticación
 */
const getUserByEmailWithPassword = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

/**
 * Crear un nuevo usuario en el sistema
 * Hashea la contraseña antes de guardarla
 */
const createUser = async (userData) => {
  const { nombre, apellido, email, password, rol } = userData;

  // Verificar si el email ya existe
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new CustomError('El correo electrónico ya se encuentra registrado.', 409, 'ConflictError');
  }

  // Hashear la contraseña
  const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

  // Crear en la base de datos
  const newUser = await prisma.user.create({
    data: {
      nombre,
      apellido,
      email,
      password: hashedPassword,
      rol: rol || 'USER', // Por defecto USER
    },
    select: {
      id: true,
      nombre: true,
      apellido: true,
      email: true,
      rol: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return newUser;
};

/**
 * Actualizar datos de un usuario
 * Si se incluye contraseña, se vuelve a hashear
 */
const updateUser = async (id, updateData) => {
  // Verificar existencia del usuario
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new CustomError('El usuario a actualizar no existe.', 404, 'NotFoundError');
  }

  const dataToUpdate = { ...updateData };

  // Si se incluye email, validar que no esté en uso por otro usuario
  if (dataToUpdate.email && dataToUpdate.email !== user.email) {
    const emailConflict = await prisma.user.findUnique({
      where: { email: dataToUpdate.email },
    });
    if (emailConflict) {
      throw new CustomError('El correo electrónico ya se encuentra registrado por otro usuario.', 409, 'ConflictError');
    }
  }

  // Si se incluye la contraseña, hay que hashearla
  if (dataToUpdate.password) {
    dataToUpdate.password = await bcrypt.hash(dataToUpdate.password, BCRYPT_SALT_ROUNDS);
  }

  // Actualizar y retornar datos actualizados sin password
  return await prisma.user.update({
    where: { id },
    data: dataToUpdate,
    select: {
      id: true,
      nombre: true,
      apellido: true,
      email: true,
      rol: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

/**
 * Eliminar físicamente un usuario por su ID
 */
const deleteUser = async (id) => {
  // Verificar existencia del usuario
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new CustomError('El usuario a eliminar no existe.', 404, 'NotFoundError');
  }

  await prisma.user.delete({
    where: { id },
  });

  return { message: 'Usuario eliminado exitosamente.' };
};

export default {
  getAllUsers,
  getUserById,
  getUserByEmailWithPassword,
  createUser,
  updateUser,
  deleteUser,
};
