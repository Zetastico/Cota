import statsService from '../services/statsService.js';

/**
 * Obtener estadísticas adaptadas al rol del usuario autenticado
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await statsService.getDashboardStats(req.user);
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
