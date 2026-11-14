import { consultar } from '../config/db.js';

export const crear = async (i, db = consultar) =>
  (
    await db(
      `INSERT INTO inscripciones (id, curso_id, usuario_id, precio, comision, pago)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [i.id, i.cursoId, i.usuarioId, i.precio, i.comision, i.pago]
    )
  ).rows[0];

export const buscar = async (cursoId, usuarioId, db = consultar) =>
  (await db('SELECT * FROM inscripciones WHERE curso_id = $1 AND usuario_id = $2', [cursoId, usuarioId]))
    .rows[0];

export const listarDe = async (usuarioId, db = consultar) =>
  (await db('SELECT * FROM inscripciones WHERE usuario_id = $1 ORDER BY creado DESC', [usuarioId])).rows;

export const eliminar = async (id, db = consultar) =>
  (await db('DELETE FROM inscripciones WHERE id = $1 RETURNING id', [id])).rows[0];
