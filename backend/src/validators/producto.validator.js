import { body, param, query } from 'express-validator';
import { CATEGORIAS } from '../config/constantes.js';
import { reglasListado } from './comunes.js';

// Los mismos campos sirven para crear (POST) y para reemplazar (PUT)
const camposProducto = [
  body('nombre')
    .trim()
    .isLength({ min: 3, max: 120 })
    .withMessage('El nombre debe tener entre 3 y 120 caracteres'),
  body('categoria')
    .isIn(CATEGORIAS)
    .withMessage(`La categoría debe ser una de: ${CATEGORIAS.join(', ')}`),
  body('precio')
    .isInt({ min: 500, max: 10000000 })
    .withMessage('El precio debe ser un entero entre 500 y 10.000.000')
    .toInt(),
  body('stock')
    .isInt({ min: 0, max: 100000 })
    .withMessage('El stock debe ser un entero entre 0 y 100.000')
    .toInt(),
  body('descripcion')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('La descripción debe tener entre 10 y 1000 caracteres'),
  body('imagen')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 300 })
    .withMessage('La imagen admite máximo 300 caracteres')
];

export const reglasListarProductos = [
  ...reglasListado,
  query('categoria').optional().isIn(CATEGORIAS).withMessage('La categoría no es válida')
];
export const reglasIdProducto = [
  param('id').trim().notEmpty().isLength({ max: 60 }).withMessage('El id no es válido')
];
export const reglasCrearProducto = camposProducto;
export const reglasActualizarProducto = [...reglasIdProducto, ...camposProducto];
