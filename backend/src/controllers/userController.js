import userService from '../services/userService.js';

/**
 * Obtener lista de todos los usuarios
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener un usuario específico por su ID
 */
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Crear un nuevo usuario de forma directa (administrativo)
 */
export const createUser = async (req, res, next) => {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente.',
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar datos de un usuario por su ID
 */
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedUser = await userService.updateUser(id, req.body);
    res.status(200).json({
      success: true,
      message: 'Usuario actualizado exitosamente.',
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar un usuario por su ID
 */
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await userService.deleteUser(id);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};
