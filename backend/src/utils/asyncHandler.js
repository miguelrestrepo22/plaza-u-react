// Express 4 no atrapa solo los errores de las funciones async.
// Esta envoltura manda cualquier error al middleware de errores con next(error).
export const asyncHandler = funcion => (req, res, next) =>
  Promise.resolve(funcion(req, res, next)).catch(next);
