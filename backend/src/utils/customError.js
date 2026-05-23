/**
 * Clase de error personalizada para manejar respuestas de error HTTP estructuradas
 */
class CustomError extends Error {
  constructor(message, statusCode, name = 'AppError') {
    super(message);
    this.statusCode = statusCode;
    this.name = name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default CustomError;
