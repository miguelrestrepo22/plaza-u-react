import { transaccion } from '../config/db.js';
import * as Curso from '../models/curso.model.js';
import * as Inscripcion from '../models/inscripcion.model.js';
import { AppError, noEncontrado } from '../utils/AppError.js';
import { nuevoId } from '../utils/ids.js';
import { cursoApi, inscripcionApi } from '../utils/mapeos.js';
import { comisionActual } from './config.service.js';

// Inscribe a la persona en un curso. Se bloquea la fila del curso para que, si dos personas
// piden el último cupo a la vez, solo una lo consiga.
export async function inscribir(usuario, cursoId, { pago = 'Contra entrega' }) {
  return transaccion(async db => {
    const curso = await Curso.buscarYBloquear(cursoId, db);
    if (!curso) throw noEncontrado('Curso');
    if (curso.owner_id === usuario.id) throw new AppError(409, 'No puedes inscribirte a tu propio curso');
    if (await Inscripcion.buscar(cursoId, usuario.id, db)) {
      throw new AppError(409, 'Ya estás inscrito en este curso');
    }
    if (curso.cupos < 1) throw new AppError(409, 'Este curso ya no tiene cupos');

    const tasa = await comisionActual(db);
    const fila = await Inscripcion.crear(
      {
        id: nuevoId('i'),
        cursoId,
        usuarioId: usuario.id,
        precio: curso.precio,
        comision: Math.round((curso.precio * tasa) / 100),
        pago
      },
      db
    );
    await Curso.ajustarCupos(cursoId, -1, db);
    return inscripcionApi(fila);
  });
}

// Cancela la inscripción y devuelve el cupo
export async function cancelar(usuario, cursoId) {
  return transaccion(async db => {
    const curso = await Curso.buscarYBloquear(cursoId, db);
    if (!curso) throw noEncontrado('Curso');
    const inscripcion = await Inscripcion.buscar(cursoId, usuario.id, db);
    if (!inscripcion) throw new AppError(404, 'No estás inscrito en este curso');
    await Inscripcion.eliminar(inscripcion.id, db);
    await Curso.ajustarCupos(cursoId, 1, db);
  });
}

export async function listarMias(usuario) {
  const filas = await Inscripcion.listarDe(usuario.id);
  const resultado = [];
  for (const fila of filas) {
    const curso = await Curso.buscarPorId(fila.curso_id);
    resultado.push({
      ...inscripcionApi(fila),
      curso: curso ? cursoApi(curso) : null
    });
  }
  return resultado;
}
