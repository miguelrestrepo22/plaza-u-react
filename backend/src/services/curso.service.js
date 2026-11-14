import * as Curso from '../models/curso.model.js';
import { AppError, noEncontrado } from '../utils/AppError.js';
import { nuevoId } from '../utils/ids.js';
import { cursoApi, normalizarTexto } from '../utils/mapeos.js';

const IMAGEN_CURSO = '/fotos/react.jpg';

function exigirPermiso(usuario, curso) {
  if (usuario.rol !== 'admin' && usuario.id !== curso.owner_id) {
    throw new AppError(403, 'Solo quien dicta el curso o un administrador pueden modificarlo');
  }
}

export async function listar({ q, nivel, categoria, orden, limite, desde }) {
  const { total, filas } = await Curso.listar({
    texto: q ? normalizarTexto(q) : undefined,
    nivel,
    categoria,
    orden,
    limite,
    desde
  });
  return { total, cursos: filas.map(cursoApi) };
}

export async function obtener(id) {
  const fila = await Curso.buscarPorId(id);
  if (!fila) throw noEncontrado('Curso');
  return cursoApi(fila);
}

export async function crear(usuario, datos) {
  const fila = await Curso.crear({
    id: nuevoId('c'),
    ownerId: usuario.id,
    ...datos,
    temario: datos.temario ?? [],
    imagen: datos.imagen || IMAGEN_CURSO
  });
  return cursoApi(fila);
}

export async function actualizar(usuario, id, datos) {
  const actual = await Curso.buscarPorId(id);
  if (!actual) throw noEncontrado('Curso');
  exigirPermiso(usuario, actual);
  const fila = await Curso.actualizar(id, {
    ...datos,
    temario: datos.temario ?? actual.temario,
    imagen: datos.imagen || actual.imagen
  });
  return cursoApi(fila);
}

export async function eliminar(usuario, id) {
  const actual = await Curso.buscarPorId(id);
  if (!actual) throw noEncontrado('Curso');
  exigirPermiso(usuario, actual);
  await Curso.eliminar(id);
}
