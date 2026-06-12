import reviewService from '../services/reviewService.js';

export const createReview = async (req, res, next) => {
  try {
    const review = await reviewService.createReview(req.body, req.user.id);
    res.status(201).json({
      success: true,
      message: 'Calificación guardada exitosamente.',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

export const getHostReviews = async (req, res, next) => {
  try {
    const reviews = await reviewService.getHostReviews(req.params.hostId);
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};
