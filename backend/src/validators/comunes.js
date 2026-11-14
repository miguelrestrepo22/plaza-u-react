import { query } from 'express-validator';

// Reglas de paginación y orden que comparten los listados de productos y cursos
export const reglasListado = [
  query('limite')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('limite debe ser un número entre 1 y 100')
    .toInt(),
  query('desde').optional().isInt({ min: 0 }).withMessage('desde debe ser 0 o más').toInt(),
  query('orden')
    .optional()
    .isIn(['recientes', 'precio_asc', 'precio_desc'])
    .withMessage('orden debe ser recientes, precio_asc o precio_desc'),
  query('q').optional().isString().isLength({ max: 100 }).withMessage('q admite máximo 100 caracteres')
];
