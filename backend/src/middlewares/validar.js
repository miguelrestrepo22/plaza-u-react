import { validationResult } from 'express-validator';
import { AppError } from '../utils/AppError.js';

// Se pone después de las reglas de express-validator. Si alguna falló, responde 400
// con la lista de campos inválidos; si no, deja pasar a la ruta.
export function validar(req, res, next) {
  const errores = validationResult(req);
  if (errores.isEmpty()) return next();
  const detalles = errores.array().map(e => ({ campo: e.path, mensaje: e.msg }));
  next(new AppError(400, 'Hay datos inválidos en la petición', detalles));
}
