import { body, param, validationResult } from 'express-validator';

/**
 * Middleware auxiliar para evaluar el resultado de las validaciones de express-validator
 */
const validateResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'ValidationError',
      message: 'Los datos enviados en la solicitud no son válidos.',
      errors: errors.array().map((err) => ({
        campo: err.path || err.param,
        mensaje: err.msg,
      })),
    });
  }
  next();
};

/**
 * Validaciones para el registro de usuarios
 */
export const registerValidation = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio.')
    .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres.'),
  body('apellido')
    .trim()
    .notEmpty().withMessage('El apellido es obligatorio.')
    .isLength({ min: 2 }).withMessage('El apellido debe tener al menos 2 caracteres.'),
  body('email')
    .trim()
    .notEmpty().withMessage('El correo electrónico es obligatorio.')
    .isEmail().withMessage('Debe proporcionar una dirección de correo electrónico válida.')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria.')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),
  body('rol')
    .optional()
    .isIn(['USER', 'HOST', 'ADMIN']).withMessage('El rol debe ser uno de los siguientes: USER, HOST, ADMIN.'),
  validateResults,
];

/**
 * Validaciones para el inicio de sesión
 */
export const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('El correo electrónico es obligatorio.')
    .isEmail().withMessage('Debe proporcionar un correo electrónico válido.')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria.'),
  validateResults,
];

/**
 * Validaciones para crear un usuario a través del CRUD administrativo
 */
export const createUserValidation = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio.'),
  body('apellido')
    .trim()
    .notEmpty().withMessage('El apellido es obligatorio.'),
  body('email')
    .trim()
    .notEmpty().withMessage('El correo electrónico es obligatorio.')
    .isEmail().withMessage('Debe proporcionar una dirección de correo electrónico válida.')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria.')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),
  body('rol')
    .optional()
    .isIn(['USER', 'HOST', 'ADMIN']).withMessage('El rol debe ser uno de los siguientes: USER, HOST, ADMIN.'),
  validateResults,
];

/**
 * Validaciones para actualizar un usuario
 */
export const updateUserValidation = [
  body('nombre')
    .optional()
    .trim()
    .notEmpty().withMessage('El nombre no puede estar vacío si se proporciona.'),
  body('apellido')
    .optional()
    .trim()
    .notEmpty().withMessage('El apellido no puede estar vacío si se proporciona.'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Debe proporcionar un correo electrónico válido.')
    .normalizeEmail(),
  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres si se proporciona.'),
  body('rol')
    .optional()
    .isIn(['USER', 'HOST', 'ADMIN']).withMessage('El rol debe ser uno de los siguientes: USER, HOST, ADMIN.'),
  validateResults,
];


/**
 * Validaciones para crear servicios
 */
export const createServiceValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('El título es obligatorio.'),

  body('description')
    .trim()
    .notEmpty().withMessage('La descripción es obligatoria.'),

  body('price')
    .isFloat({ gt: 0 })
    .withMessage('El precio debe ser mayor que cero.'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('La categoría es obligatoria.'),

  validateResults,
];

/**
 * Validaciones para actualizar servicios
 */
export const updateServiceValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El título no puede estar vacío.'),

  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('La descripción no puede estar vacía.'),

  body('price')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('El precio debe ser mayor que cero.'),

  body('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('La categoría no puede estar vacía.'),

  validateResults,
];



/**
 * Validación para el parámetro ID en rutas dinámicas (debe ser UUID v4)
 */
export const idParamValidation = [
  param('id')
    .isUUID(4).withMessage('El parámetro ID debe ser un UUID v4 válido.'),
  validateResults,
];

/**
 * Validaciones para crear solicitudes de servicios
 */
export const createRequestValidation = [
  body('serviceId')
    .trim()
    .notEmpty().withMessage('El ID del servicio es obligatorio.')
    .isUUID(4).withMessage('El ID del servicio debe ser un UUID v4 válido.'),
  body('message')
    .trim()
    .notEmpty().withMessage('El mensaje para el proveedor es obligatorio.'),
  body('contactPhone')
    .trim()
    .notEmpty().withMessage('El teléfono de contacto es obligatorio.')
    .isLength({ min: 7 }).withMessage('El teléfono debe tener al menos 7 dígitos.'),
  body('desiredDate')
    .notEmpty().withMessage('La fecha deseada de ejecución es obligatoria.')
    .isISO8601().withMessage('Debe proporcionar una fecha en formato ISO8601 válido (AAAA-MM-DD).'),
  body('paymentMethod')
    .notEmpty().withMessage('El método de pago es obligatorio.')
    .isIn(['CASH', 'QR', 'CARD']).withMessage('El método de pago debe ser CASH, QR o CARD.'),
  validateResults,
];
