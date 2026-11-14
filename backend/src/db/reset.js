// Borra la base local y la deja otra vez con los datos de ejemplo:  npm run db:reset
import { rmSync } from 'node:fs';
import { config } from '../config/env.js';
import { cerrar, conectar } from '../config/db.js';
import { sembrarSiEstaVacia } from './sembrar.js';

if (config.databaseUrl) {
  console.log(
    'Hay DATABASE_URL: no borro una base remota. Hazlo a mano desde Supabase si de verdad lo necesitas.'
  );
  process.exit(1);
}
if (config.carpetaPglite !== 'memory') rmSync(config.carpetaPglite, { recursive: true, force: true });
await conectar();
await sembrarSiEstaVacia();
await cerrar();
console.log('Base de datos reiniciada con los datos de ejemplo.');
