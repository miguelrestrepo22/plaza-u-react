import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import * as Usuario from '../models/usuario.model.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Revisa el token del encabezado "Authorization: Bearer <token>".
// El usuario se vuelve a leer de la base: así, si borran la cuenta o le cambian el rol,
// el token viejo deja de servir de inmediato.
export const autenticar = asyncHandler(async (req, res, next) => {
  const [tipo, token] = (req.headers.authorization || '').split(' ');
  if (tipo !== 'Bearer' || !token) {
    throw new AppError(401, 'Debes iniciar sesión: falta el token en el encabezado Authorization');
  }

  let carga;
  try {
    carga = jwt.verify(token, config.jwtSecreto);
  } catch {
    throw new AppError(401, 'El token no es válido o ya venció');
  }

  const usuario = await Usuario.buscarPorId(carga.sub);
  if (!usuario) throw new AppError(401, 'La cuenta de este token ya no existe');
  req.usuario = { id: usuario.id, rol: usuario.rol };
  next();
});

// Deja pasar solo a los roles indicados. Va siempre DESPUÉS de autenticar.
export const exigirRol =
  (...roles) =>
  (req, res, next) =>
    roles.includes(req.usuario.rol) ? next() : next(new AppError(403, 'No tienes permiso para esta acción'));
