import { consultar } from '../config/db.js';

// El número del pedido sale de una secuencia de la base: PU-1001, PU-1002...
export const siguienteNumero = async db => (await db("SELECT nextval('pedido_seq')::int AS n")).rows[0].n;

export const crear = async (p, db = consultar) =>
  (
    await db(
      `INSERT INTO pedidos (id, comprador_id, vendedor_id, items, total, comision, pago, cliente)
       VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7, $8::jsonb) RETURNING *`,
      [
        p.id,
        p.compradorId,
        p.vendedorId,
        JSON.stringify(p.items),
        p.total,
        p.comision,
        p.pago,
        JSON.stringify(p.cliente)
      ]
    )
  ).rows[0];

export const listarTodos = async (db = consultar) =>
  (await db('SELECT * FROM pedidos ORDER BY creado DESC, id DESC')).rows;

// Los pedidos donde la persona es compradora o vendedora
export const listarDe = async (usuarioId, db = consultar) =>
  (
    await db(
      'SELECT * FROM pedidos WHERE comprador_id = $1 OR vendedor_id = $1 ORDER BY creado DESC, id DESC',
      [usuarioId]
    )
  ).rows;

export const buscarPorId = async (id, db = consultar) =>
  (await db('SELECT * FROM pedidos WHERE id = $1', [id])).rows[0];

export const buscarYBloquear = async (id, db) =>
  (await db('SELECT * FROM pedidos WHERE id = $1 FOR UPDATE', [id])).rows[0];

export const actualizarEstado = async (id, estado, db = consultar) =>
  (await db('UPDATE pedidos SET estado = $2, actualizado = now() WHERE id = $1 RETURNING *', [id, estado]))
    .rows[0];
