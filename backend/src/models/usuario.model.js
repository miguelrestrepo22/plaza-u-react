import { consultar } from '../config/db.js';

// Modelo de usuarios: solo habla con la base de datos, no tiene reglas del negocio.
export const buscarPorEmail = async (email, db = consultar) =>
  (await db('SELECT * FROM usuarios WHERE email = $1', [email])).rows[0];

export const buscarPorId = async (id, db = consultar) =>
  (await db('SELECT * FROM usuarios WHERE id = $1', [id])).rows[0];

export const listar = async (db = consultar) => (await db('SELECT * FROM usuarios ORDER BY creado, id')).rows;

// Los vendedores son los estudiantes (el administrador no vende ni dicta cursos)
export const listarVendedores = async (db = consultar) =>
  (await db("SELECT * FROM usuarios WHERE rol = 'estudiante' ORDER BY nombre")).rows;

export const crear = async (u, db = consultar) =>
  (
    await db(
      `INSERT INTO usuarios (id, nombre, email, pass_hash, rol, carrera, whatsapp, negocio)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [u.id, u.nombre, u.email, u.passHash, u.rol, u.carrera, u.whatsapp, u.negocio]
    )
  ).rows[0];

export const eliminar = async (id, db = consultar) =>
  (await db('DELETE FROM usuarios WHERE id = $1 RETURNING id', [id])).rows[0];
