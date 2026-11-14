import bcrypt from 'bcryptjs';
import { consultar } from '../config/db.js';
import { cursosEjemplo, productosEjemplo, usuariosEjemplo } from './datosEjemplo.js';

// Carga los datos de ejemplo solo si la base está vacía.
export async function sembrarSiEstaVacia() {
  const { rows } = await consultar('SELECT count(*)::int AS n FROM usuarios');
  if (rows[0].n > 0) return false;

  for (const u of usuariosEjemplo) {
    const hash = await bcrypt.hash(u.clave, 10);
    await consultar(
      `INSERT INTO usuarios (id, nombre, email, pass_hash, rol, carrera, whatsapp, negocio)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [u.id, u.nombre, u.email, hash, u.rol, u.carrera, u.whatsapp, u.negocio]
    );
  }

  // Cada producto y curso se crea con una hora distinta para que "los más nuevos" tenga un orden claro
  for (const [i, p] of productosEjemplo.entries()) {
    await consultar(
      `INSERT INTO productos (id, owner_id, nombre, categoria, precio, stock, descripcion, imagen, creado)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, now() - ($9 || ' hours')::interval)`,
      [p.id, p.owner_id, p.nombre, p.categoria, p.precio, p.stock, p.descripcion, p.imagen, String(i)]
    );
  }
  for (const [i, c] of cursosEjemplo.entries()) {
    await consultar(
      `INSERT INTO cursos (id, owner_id, titulo, categoria, nivel, precio, cupos, horario, duracion, descripcion, temario, imagen, creado)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::jsonb, $12, now() - ($13 || ' hours')::interval)`,
      [
        c.id,
        c.owner_id,
        c.titulo,
        c.categoria,
        c.nivel,
        c.precio,
        c.cupos,
        c.horario,
        c.duracion,
        c.descripcion,
        JSON.stringify(c.temario),
        c.imagen,
        String(i)
      ]
    );
  }
  return true;
}
