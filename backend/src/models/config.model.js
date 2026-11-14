import { consultar } from '../config/db.js';

export const obtener = async (clave, db = consultar) =>
  (await db('SELECT valor FROM config WHERE clave = $1', [clave])).rows[0]?.valor;

export const guardar = (clave, valor, db = consultar) =>
  db(
    `INSERT INTO config (clave, valor) VALUES ($1, $2)
     ON CONFLICT (clave) DO UPDATE SET valor = EXCLUDED.valor`,
    [clave, String(valor)]
  );
