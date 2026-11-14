import { body } from 'express-validator';

export const reglasRegistro = [
  body('nombre')
    .trim()
    .isLength({ min: 3, max: 80 })
    .withMessage('El nombre debe tener entre 3 y 80 caracteres'),
  body('email').trim().toLowerCase().isEmail().withMessage('El correo no es válido'),
  body('password')
    .isLength({ min: 8, max: 72 })
    .withMessage('La contraseña debe tener entre 8 y 72 caracteres'),
  body('carrera')
    .optional()
    .trim()
    .isLength({ max: 80 })
    .withMessage('La carrera admite máximo 80 caracteres'),
  body('whatsapp')
    .optional({ values: 'falsy' })
    .matches(/^\d{10}$/)
    .withMessage('El WhatsApp debe tener 10 dígitos'),
  body('negocio')
    .optional()
    .trim()
    .isLength({ max: 80 })
    .withMessage('El negocio admite máximo 80 caracteres')
];

export const reglasLogin = [
  body('email').trim().toLowerCase().isEmail().withMessage('El correo no es válido'),
  body('password').notEmpty().withMessage('Escribe la contraseña')
];
