import 'dotenv/config';

// Todas las variables de entorno se leen acá, en un solo lugar.
// Si falta alguna se usa un valor de desarrollo para que el proyecto arranque sin configurar nada.
export const config = {
  entorno: process.env.NODE_ENV || 'development',
  puerto: Number(process.env.PORT) || 3000,
  jwtSecreto: process.env.JWT_SECRET || 'secreto-solo-para-desarrollo-cambialo',
  jwtDuracion: process.env.JWT_EXPIRES_IN || '8h',
  // Si hay DATABASE_URL nos conectamos a PostgreSQL (por ejemplo Supabase).
  // Si no la hay, usamos un PostgreSQL embebido (PGlite) guardado en la carpeta .data
  databaseUrl: process.env.DATABASE_URL || '',
  databaseSsl: process.env.DATABASE_SSL !== 'false',
  // En Supabase las tablas de la API quedan en su propio esquema, separado de las del sitio publicado
  databaseEsquema: process.env.DATABASE_SCHEMA || 'plaza_express',
  carpetaPglite: process.env.PGLITE_DIR || '.data/pglite' // 'memory' = solo en memoria
};
