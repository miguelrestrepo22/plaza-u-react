import { body, param } from 'express-validator';
import { ESTADOS, PAGOS } from '../config/constantes.js';

export const reglasCrearPedido = [
  body('items').isArray({ min: 1, max: 30 }).withMessage('Envía entre 1 y 30 productos en items'),
  body('items.*.productoId').isString().trim().notEmpty().withMessage('Cada item necesita un productoId'),
  body('items.*.cantidad')
    .isInt({ min: 1, max: 99 })
    .withMessage('La cantidad debe ser un entero entre 1 y 99')
    .toInt(),
  body('cliente.nombre')
    .trim()
    .isLength({ min: 3, max: 80 })
    .withMessage('El nombre debe tener entre 3 y 80 caracteres'),
  body('cliente.celular')
    .matches(/^\d{10}$/)
    .withMessage('El celular debe tener 10 dígitos'),
  body('cliente.direccion')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('La dirección de entrega debe tener entre 5 y 200 caracteres'),
  body('cliente.notas')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 300 })
    .withMessage('Las notas admiten máximo 300 caracteres'),
  body('pago')
    .isIn(PAGOS)
    .withMessage(`La forma de pago debe ser una de: ${PAGOS.join(', ')}`)
];

export const reglasIdPedido = [
  param('id')
    .trim()
    .matches(/^PU-\d+$/)
    .withMessage('El id del pedido debe verse como PU-1001')
];
export const reglasCambiarEstado = [
  ...reglasIdPedido,
  body('estado')
    .isIn(ESTADOS)
    .withMessage(`El estado debe ser uno de: ${ESTADOS.join(', ')}`)
];
