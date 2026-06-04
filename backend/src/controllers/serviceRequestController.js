import serviceRequestService from '../services/serviceRequestService.js';

/**
 * Crear una nueva solicitud de servicio (USER)
 */
export const createRequest = async (req, res, next) => {
  try {
    const request = await serviceRequestService.createRequest(
      req.body,
      req.user.id
    );

    res.status(201).json({
      success: true,
      message: 'Solicitud enviada exitosamente.',
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener las solicitudes recibidas por el HOST autenticado
 */
export const getMyServiceRequests = async (req, res, next) => {
  try {
    const requests = await serviceRequestService.getMyServiceRequests(req.user.id);

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Aceptar una solicitud de servicio (HOST)
 */
export const acceptRequest = async (req, res, next) => {
  try {
    const request = await serviceRequestService.acceptRequest(
      req.params.id,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message: 'Solicitud aceptada exitosamente.',
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Rechazar una solicitud de servicio (HOST)
 */
export const rejectRequest = async (req, res, next) => {
  try {
    const request = await serviceRequestService.rejectRequest(
      req.params.id,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message: 'Solicitud rechazada exitosamente.',
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener solicitudes realizadas por el USER autenticado
 */
export const getMyRequests = async (req, res, next) => {
  try {
    const requests = await serviceRequestService.getMyRequests(req.user.id);
    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};
