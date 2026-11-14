import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { config } from './config/env.js';
import { openapi } from './docs/openapi.js';
import { manejarErrores, rutaNoEncontrada } from './middlewares/errorHandler.js';
import rutas from './routes/index.js';

// Arma la aplicación de Express. Está separada de server.js para poder probarla sin abrir un puerto.
export function crearApp() {
  const app = express();

  app.use(helmet({ contentSecurityPolicy: false })); // encabezados de seguridad (la CSP se apaga por Swagger UI)
  app.use(cors()); // permite que el frontend (otro puerto) llame a la API
  app.use(express.json({ limit: '100kb' })); // lee el cuerpo JSON de las peticiones
  if (config.entorno !== 'test') app.use(morgan('dev')); // registro de cada petición en la consola

  app.use('/api', rutas);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapi, { customSiteTitle: 'Plaza U · API' }));
  app.get('/', (req, res) => res.redirect('/api-docs'));

  app.use(rutaNoEncontrada); // si nada respondió: 404
  app.use(manejarErrores); // y todos los errores terminan acá
  return app;
}
