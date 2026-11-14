import { body, param } from 'express-validator';
import { COMISION_MAXIMA } from '../config/constantes.js';

export const reglasConfig = [
  body('comisionPorcentaje')
    .isInt({ min: 0, max: COMISION_MAXIMA })
    .withMessage(`La comisión debe ser un entero entre 0 y ${COMISION_MAXIMA}`)
    .toInt()
];
export const reglasIdUsuario = [param('id').trim().notEmpty().withMessage('El id del usuario no es válido')];
