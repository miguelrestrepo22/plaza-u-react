import { crearApp } from './app.js';
import { conectar } from './config/db.js';
import { config } from './config/env.js';
import { sembrarSiEstaVacia } from './db/sembrar.js';

// Punto de entrada: conecta la base de datos, carga los datos de ejemplo y abre el puerto.
try {
  const motor = await conectar();
  const sembro = await sembrarSiEstaVacia();
  crearApp().listen(config.puerto, () => {
    console.log(`Plaza U API lista en http://localhost:${config.puerto}`);
    console.log(`  Base de datos: ${motor}${sembro ? ' (con datos de ejemplo cargados)' : ''}`);
    console.log(`  Documentación: http://localhost:${config.puerto}/api-docs`);
  });
} catch (error) {
  console.error('No se pudo iniciar el servidor:', error.message);
  process.exit(1);
}
