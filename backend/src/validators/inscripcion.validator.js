import { body, param } from 'express-validator';
import { PAGOS } from '../config/constantes.js';

export const reglasInscribir = [
  param('id').trim().notEmpty().withMessage('El id del curso no es válido'),
  body('pago')
    .optional()
    .isIn(PAGOS)
    .withMessage(`La forma de pago debe ser una de: ${PAGOS.join(', ')}`)
];
export const reglasCancelarInscripcion = [
  param('id').trim().notEmpty().withMessage('El id del curso no es válido')
];
