import { consultar } from '../config/db.js';

const ORDENES = {
  recientes: 'creado DESC, id',
  precio_asc: 'precio ASC, id',
  precio_desc: 'precio DESC, id'
};

const SIN_TILDES = "translate(lower(titulo || ' ' || descripcion || ' ' || categoria), 'áéíóúü', 'aeiouu')";

export async function listar(
  { texto, nivel, categoria, orden = 'recientes', limite = 50, desde = 0 },
  db = consultar
) {
  const condiciones = [];
  const params = [];
  if (nivel) {
    params.push(nivel);
    condiciones.push(`nivel = $${params.length}`);
  }
  if (categoria) {
    params.push(categoria);
    condiciones.push(`categoria = $${params.length}`);
  }
  if (texto) {
    params.push(`%${texto}%`);
    condiciones.push(`${SIN_TILDES} LIKE $${params.length}`);
  }
  const donde = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';

  const total = (await db(`SELECT count(*)::int AS n FROM cursos ${donde}`, params)).rows[0].n;
  params.push(limite, desde);
  const { rows } = await db(
    `SELECT * FROM cursos ${donde} ORDER BY ${ORDENES[orden]} LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );
  return { total, filas: rows };
}

export const buscarPorId = async (id, db = consultar) =>
  (await db('SELECT * FROM cursos WHERE id = $1', [id])).rows[0];

// Igual que con los productos: bloquea la fila para que dos inscripciones simultáneas no se pisen el último cupo
export const buscarYBloquear = async (id, db) =>
  (await db('SELECT * FROM cursos WHERE id = $1 FOR UPDATE', [id])).rows[0];

export const crear = async (c, db = consultar) =>
  (
    await db(
      `INSERT INTO cursos (id, owner_id, titulo, categoria, nivel, precio, cupos, horario, duracion, descripcion, temario, imagen)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::jsonb, $12) RETURNING *`,
      [
        c.id,
        c.ownerId,
        c.titulo,
        c.categoria,
        c.nivel,
        c.precio,
        c.cupos,
        c.horario,
        c.duracion,
        c.descripcion,
        JSON.stringify(c.temario),
        c.imagen
      ]
    )
  ).rows[0];

export const actualizar = async (id, c, db = consultar) =>
  (
    await db(
      `UPDATE cursos SET titulo = $2, categoria = $3, nivel = $4, precio = $5, cupos = $6, horario = $7,
              duracion = $8, descripcion = $9, temario = $10::jsonb, imagen = $11
       WHERE id = $1 RETURNING *`,
      [
        id,
        c.titulo,
        c.categoria,
        c.nivel,
        c.precio,
        c.cupos,
        c.horario,
        c.duracion,
        c.descripcion,
        JSON.stringify(c.temario),
        c.imagen
      ]
    )
  ).rows[0];

export const eliminar = async (id, db = consultar) =>
  (await db('DELETE FROM cursos WHERE id = $1 RETURNING id', [id])).rows[0];

export const ajustarCupos = (id, cambio, db) =>
  db('UPDATE cursos SET cupos = cupos + $2 WHERE id = $1', [id, cambio]);
