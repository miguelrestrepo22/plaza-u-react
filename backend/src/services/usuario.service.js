import * as Usuario from '../models/usuario.model.js';
import { AppError, noEncontrado } from '../utils/AppError.js';
import { usuarioApi, vendedorApi } from '../utils/mapeos.js';

export async function listarVendedores() {
  return (await Usuario.listarVendedores()).map(vendedorApi);
}

// Solo para el administrador
export async function listar() {
  return (await Usuario.listar()).map(usuarioApi);
}

export async function eliminar(admin, id) {
  const objetivo = await Usuario.buscarPorId(id);
  if (!objetivo) throw noEncontrado('Usuario');
  if (objetivo.rol === 'admin') throw new AppError(409, 'No se puede eliminar a un administrador');
  await Usuario.eliminar(id); // sus productos, cursos e inscripciones se borran en cascada
}
