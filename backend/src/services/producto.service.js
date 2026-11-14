import { IMAGEN_POR_DEFECTO } from '../config/constantes.js';
import * as Producto from '../models/producto.model.js';
import { AppError, noEncontrado } from '../utils/AppError.js';
import { nuevoId } from '../utils/ids.js';
import { normalizarTexto, productoApi } from '../utils/mapeos.js';

// Solo el dueño del producto o un administrador pueden modificarlo
function exigirPermiso(usuario, producto) {
  if (usuario.rol !== 'admin' && usuario.id !== producto.owner_id) {
    throw new AppError(403, 'Solo el dueño del producto o un administrador pueden modificarlo');
  }
}

export async function listar({ q, categoria, orden, limite, desde }) {
  const { total, filas } = await Producto.listar({
    texto: q ? normalizarTexto(q) : undefined,
    categoria,
    orden,
    limite,
    desde
  });
  return { total, productos: filas.map(productoApi) };
}

export async function obtener(id) {
  const fila = await Producto.buscarPorId(id);
  if (!fila) throw noEncontrado('Producto');
  return productoApi(fila);
}

export async function crear(usuario, datos) {
  const fila = await Producto.crear({
    id: nuevoId('p'),
    ownerId: usuario.id,
    ...datos,
    imagen: datos.imagen || IMAGEN_POR_DEFECTO
  });
  return productoApi(fila);
}

export async function actualizar(usuario, id, datos) {
  const actual = await Producto.buscarPorId(id);
  if (!actual) throw noEncontrado('Producto');
  exigirPermiso(usuario, actual);
  const fila = await Producto.actualizar(id, {
    ...datos,
    imagen: datos.imagen || actual.imagen
  });
  return productoApi(fila);
}

export async function eliminar(usuario, id) {
  const actual = await Producto.buscarPorId(id);
  if (!actual) throw noEncontrado('Producto');
  exigirPermiso(usuario, actual);
  await Producto.eliminar(id);
}
