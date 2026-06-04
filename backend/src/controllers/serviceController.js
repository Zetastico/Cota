import serviceService from '../services/serviceService.js';
import CustomError from '../utils/customError.js';

/**
 * Obtener todos los servicios registrados (Uso administrativo)
 */
export const getAllServices = async (req, res, next) => {
  try {
    const services = await serviceService.getAllServices();

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener un servicio específico por ID
 */
export const getServiceById = async (req, res, next) => {
  try {
    const service = await serviceService.getServiceById(req.params.id);

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicServices = async (req, res, next) => {
  try {
    const { data, pagination } = await serviceService.getPublicServices(req.query);
    res.status(200).json({
      success: true,
      count: data.length,
      data,
      pagination,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener los servicios del HOST autenticado
 */
export const getMyServices = async (req, res, next) => {
  try {
    const services = await serviceService.getMyServices(req.user.id);
    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener servicios pendientes de aprobación (ADMIN)
 */
export const getPendingServices = async (req, res, next) => {
  try {
    const services = await serviceService.getPendingServices();
    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Crear un nuevo servicio (HOST)
 */
export const createService = async (req, res, next) => {
  try {
    const service = await serviceService.createService(
      req.body,
      req.user.id
    );

    res.status(201).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar un servicio (HOST con pertenencia, o ADMIN)
 */
export const updateService = async (req, res, next) => {
  try {
    const serviceToUpdate = await serviceService.getServiceById(req.params.id);

    // Validar propiedad (solo el propietario del servicio o un ADMIN pueden editar)
    if (serviceToUpdate.ownerId !== req.user.id && req.user.rol !== 'ADMIN') {
      throw new CustomError(
        'No está autorizado para modificar un servicio que no le pertenece.',
        403,
        'ForbiddenError'
      );
    }

    const updatedService = await serviceService.updateService(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      data: updatedService,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar un servicio (HOST con pertenencia, o ADMIN)
 */
export const deleteService = async (req, res, next) => {
  try {
    const serviceToDelete = await serviceService.getServiceById(req.params.id);

    // Validar propiedad (solo el propietario o un ADMIN pueden eliminar)
    if (serviceToDelete.ownerId !== req.user.id && req.user.rol !== 'ADMIN') {
      throw new CustomError(
        'No está autorizado para eliminar un servicio que no le pertenece.',
        403,
        'ForbiddenError'
      );
    }

    const result = await serviceService.deleteService(req.params.id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Aprobar un servicio (ADMIN)
 */
export const approveService = async (req, res, next) => {
  try {
    const service = await serviceService.approveService(req.params.id);

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Rechazar un servicio (ADMIN)
 */
export const rejectService = async (req, res, next) => {
  try {
    const service = await serviceService.rejectService(req.params.id);

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};