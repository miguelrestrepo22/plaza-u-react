import { AppError } from '../utils/AppError.js';

// Cuando ninguna ruta responde, llegamos acá
export const rutaNoEncontrada = (req, res, next) =>
  next(new AppError(404, `No existe la ruta ${req.method} ${req.originalUrl}`));

// Último middleware: todos los errores terminan acá y salen con el mismo formato:
// { "error": { "estado": 404, "mensaje": "...", "detalles": [...] } }
export function manejarErrores(error, req, res, next) {
  let estado = 500;
  let mensaje = 'Error interno del servidor';
  let detalles;

  if (error instanceof AppError) {
    estado = error.estado;
    mensaje = error.message;
    detalles = error.detalles;
  } else if (error.type === 'entity.parse.failed') {
    estado = 400;
    mensaje = 'El cuerpo de la petición no es un JSON válido';
  } else if (error.type === 'entity.too.large') {
    estado = 413;
    mensaje = 'El cuerpo de la petición es demasiado grande';
  } else if (error.code === '23505') {
    estado = 409; // violación de UNIQUE en la base de datos
    mensaje = 'Ya existe un registro con esos datos';
  } else if (error.code === '23503') {
    estado = 409; // violación de llave foránea
    mensaje = 'El registro depende de otro que no existe o que no se puede borrar';
  }

  // Los errores 500 son inesperados: se registran en la consola; al cliente no se le muestra el detalle
  if (estado >= 500) console.error(error);

  const cuerpo = { estado, mensaje };
  if (detalles) cuerpo.detalles = detalles;
  res.status(estado).json({ error: cuerpo });
}
