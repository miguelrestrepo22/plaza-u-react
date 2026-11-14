import { readFileSync } from 'node:fs';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import pg from 'pg';
import { PGlite } from '@electric-sql/pglite';
import { config } from './env.js';

// Capa de conexión. Los modelos nunca saben con qué motor hablan: solo usan consultar() y transaccion().
//  - Con DATABASE_URL: PostgreSQL real (por ejemplo la base de Supabase), con un pool de conexiones.
//  - Sin DATABASE_URL: PGlite, un PostgreSQL embebido que no necesita instalar nada.
let pool = null;
let embebida = null;
let motor = '';

export async function conectar() {
  if (config.databaseUrl) {
    if (!/^[a-z_][a-z0-9_]*$/.test(config.databaseEsquema)) {
      throw new Error('DATABASE_SCHEMA solo puede tener letras minúsculas, números y guion bajo');
    }
    pool = new pg.Pool({
      connectionString: config.databaseUrl,
      ssl: config.databaseSsl ? { rejectUnauthorized: false } : false
    });
    // Cada conexión nueva trabaja dentro del esquema propio de la API. Esa consulta queda de primera
    // en la cola de la conexión, así que corre antes que cualquier otra.
    pool.on('connect', cliente => cliente.query(`SET search_path TO ${config.databaseEsquema}, public`));
    await pool.query(`CREATE SCHEMA IF NOT EXISTS ${config.databaseEsquema}`); // si falla, el error sale acá
    motor = `PostgreSQL (esquema ${config.databaseEsquema})`;
  } else {
    const enMemoria = config.carpetaPglite === 'memory';
    if (!enMemoria) mkdirSync(dirname(config.carpetaPglite), { recursive: true });
    embebida = new PGlite(enMemoria ? undefined : config.carpetaPglite);
    await embebida.waitReady;
    motor = enMemoria ? 'PGlite (en memoria)' : 'PGlite (archivo local)';
  }
  await ejecutarScript(readFileSync(new URL('../db/schema.sql', import.meta.url), 'utf8'));
  return motor;
}

export const motorActual = () => motor;

// Ejecuta una consulta con parámetros ($1, $2...) y devuelve { rows }
export function consultar(texto, parametros = []) {
  return pool ? pool.query(texto, parametros) : embebida.query(texto, parametros);
}

// Ejecuta varias sentencias seguidas (se usa para el esquema)
export function ejecutarScript(sql) {
  return pool ? pool.query(sql) : embebida.exec(sql);
}

// Agrupa varias consultas en una transacción: si algo falla, no queda nada a medias.
// La función recibe un "consultar" propio de la transacción.
export async function transaccion(trabajo) {
  if (!pool) {
    return embebida.transaction(tx => trabajo((texto, params = []) => tx.query(texto, params)));
  }
  const cliente = await pool.connect();
  try {
    await cliente.query('BEGIN');
    const resultado = await trabajo((texto, params = []) => cliente.query(texto, params));
    await cliente.query('COMMIT');
    return resultado;
  } catch (error) {
    await cliente.query('ROLLBACK');
    throw error;
  } finally {
    cliente.release();
  }
}

export async function cerrar() {
  if (pool) await pool.end();
  if (embebida) await embebida.close();
  pool = null;
  embebida = null;
}
