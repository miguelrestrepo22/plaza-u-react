import { consultar } from '../config/db.js';

// Las únicas formas de ordenar que acepta la API. Es una lista cerrada a propósito:
// así el texto que llega del cliente nunca se mete directo en la consulta.
const ORDENES = {
  recientes: 'creado DESC, id',
  precio_asc: 'precio ASC, id',
  precio_desc: 'precio DESC, id'
};

// Convierte las vocales con tilde para poder buscar sin importar los acentos
const SIN_TILDES = "translate(lower(nombre || ' ' || descripcion || ' ' || categoria), 'áéíóúü', 'aeiouu')";

export async function listar(
  { texto, categoria, orden = 'recientes', limite = 50, desde = 0 },
  db = consultar
) {
  const condiciones = [];
  const params = [];
  if (categoria) {
    params.push(categoria);
    condiciones.push(`categoria = $${params.length}`);
  }
  if (texto) {
    params.push(`%${texto}%`);
    condiciones.push(`${SIN_TILDES} LIKE $${params.length}`);
  }
  const donde = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';

  const total = (await db(`SELECT count(*)::int AS n FROM productos ${donde}`, params)).rows[0].n;
  params.push(limite, desde);
  const { rows } = await db(
    `SELECT * FROM productos ${donde} ORDER BY ${ORDENES[orden]} LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );
  return { total, filas: rows };
}

export const buscarPorId = async (id, db = consultar) =>
  (await db('SELECT * FROM productos WHERE id = $1', [id])).rows[0];

// Trae varios productos y los BLOQUEA hasta que termine la transacción.
// Si dos personas compran lo último a la vez, la segunda espera y ve el stock ya descontado.
export async function bloquearVarios(ids, db) {
  const marcas = ids.map((_, i) => `$${i + 1}`).join(', ');
  return (await db(`SELECT * FROM productos WHERE id IN (${marcas}) ORDER BY id FOR UPDATE`, ids)).rows;
}

export const crear = async (p, db = consultar) =>
  (
    await db(
      `INSERT INTO productos (id, owner_id, nombre, categoria, precio, stock, descripcion, imagen)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [p.id, p.ownerId, p.nombre, p.categoria, p.precio, p.stock, p.descripcion, p.imagen]
    )
  ).rows[0];

export const actualizar = async (id, p, db = consultar) =>
  (
    await db(
      `UPDATE productos SET nombre = $2, categoria = $3, precio = $4, stock = $5, descripcion = $6, imagen = $7
       WHERE id = $1 RETURNING *`,
      [id, p.nombre, p.categoria, p.precio, p.stock, p.descripcion, p.imagen]
    )
  ).rows[0];

export const eliminar = async (id, db = consultar) =>
  (await db('DELETE FROM productos WHERE id = $1 RETURNING id', [id])).rows[0];

// Suma (o resta, con un número negativo) unidades al inventario
export const ajustarStock = (id, cambio, db) =>
  db('UPDATE productos SET stock = stock + $2 WHERE id = $1', [id, cambio]);
