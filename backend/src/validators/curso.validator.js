import { body, param, query } from 'express-validator';
import { CAT_CURSOS, NIVELES } from '../config/constantes.js';
import { reglasListado } from './comunes.js';

const camposCurso = [
  body('titulo')
    .trim()
    .isLength({ min: 5, max: 120 })
    .withMessage('El título debe tener entre 5 y 120 caracteres'),
  body('categoria')
    .isIn(CAT_CURSOS)
    .withMessage(`La categoría debe ser una de: ${CAT_CURSOS.join(', ')}`),
  body('nivel')
    .isIn(NIVELES)
    .withMessage(`El nivel debe ser uno de: ${NIVELES.join(', ')}`),
  body('precio')
    .isInt({ min: 0, max: 5000000 })
    .withMessage('El precio debe ser un entero entre 0 y 5.000.000 (0 = gratis)')
    .toInt(),
  body('cupos')
    .isInt({ min: 0, max: 500 })
    .withMessage('Los cupos deben ser un entero entre 0 y 500')
    .toInt(),
  body('horario')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('El horario debe tener entre 5 y 200 caracteres'),
  body('duracion')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('La duración debe tener entre 3 y 100 caracteres'),
  body('descripcion')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('La descripción debe tener entre 10 y 1000 caracteres'),
  body('temario')
    .optional()
    .isArray({ max: 20 })
    .withMessage('El temario debe ser una lista de máximo 20 temas'),
  body('temario.*')
    .isString()
    .trim()
    .isLength({ min: 1, max: 120 })
    .withMessage('Cada tema del temario debe ser texto de máximo 120 caracteres'),
  body('imagen')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 300 })
    .withMessage('La imagen admite máximo 300 caracteres')
];

export const reglasListarCursos = [
  ...reglasListado,
  query('nivel').optional().isIn(NIVELES).withMessage('El nivel no es válido'),
  query('categoria').optional().isIn(CAT_CURSOS).withMessage('La categoría no es válida')
];
export const reglasIdCurso = [
  param('id').trim().notEmpty().isLength({ max: 60 }).withMessage('El id no es válido')
];
export const reglasCrearCurso = camposCurso;
export const reglasActualizarCurso = [...reglasIdCurso, ...camposCurso];
