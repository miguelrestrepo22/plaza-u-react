import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import * as Usuario from '../models/usuario.model.js';
import { AppError, noEncontrado } from '../utils/AppError.js';
import { nuevoId } from '../utils/ids.js';
import { usuarioApi } from '../utils/mapeos.js';

// El token lleva el id (subject) y el rol; vence según JWT_EXPIRES_IN (8 horas por defecto)
export const firmarToken = usuario =>
  jwt.sign({ rol: usuario.rol }, config.jwtSecreto, {
    subject: usuario.id,
    expiresIn: config.jwtDuracion
  });

export async function registrar({ nombre, email, password, carrera = '', whatsapp = '', negocio = '' }) {
  if (await Usuario.buscarPorEmail(email)) {
    throw new AppError(409, 'Ya existe una cuenta con ese correo');
  }
  // Se guarda el hash bcrypt (con sal incluida), nunca la contraseña
  const passHash = await bcrypt.hash(password, 10);
  const fila = await Usuario.crear({
    id: nuevoId('u'),
    nombre,
    email,
    passHash,
    rol: 'estudiante', // cualquiera que se registre es estudiante; el administrador no se crea por la API
    carrera,
    whatsapp,
    negocio
  });
  return { token: firmarToken(fila), usuario: usuarioApi(fila) };
}

export async function iniciarSesion({ email, password }) {
  const fila = await Usuario.buscarPorEmail(email);
  // El mismo mensaje si falla el correo o la clave, para no revelar qué cuentas existen
  if (!fila || !(await bcrypt.compare(password, fila.pass_hash))) {
    throw new AppError(401, 'Correo o contraseña incorrectos');
  }
  return { token: firmarToken(fila), usuario: usuarioApi(fila) };
}

export async function perfil(id) {
  const fila = await Usuario.buscarPorId(id);
  if (!fila) throw noEncontrado('Usuario');
  return usuarioApi(fila);
}
