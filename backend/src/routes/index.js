import { Router } from 'express';
import { motorActual } from '../config/db.js';
import admin from './admin.routes.js';
import auth from './auth.routes.js';
import cursos from './cursos.routes.js';
import pedidos from './pedidos.routes.js';
import productos from './productos.routes.js';

// Acá se conectan todas las rutas bajo el prefijo /api
const router = Router();

router.get('/health', (req, res) => {
  res.json({
    estado: 'ok',
    servicio: 'plaza-u-api',
    baseDeDatos: motorActual()
  });
});

router.use('/auth', auth);
router.use('/productos', productos);
router.use('/cursos', cursos);
router.use('/pedidos', pedidos);
router.use('/', admin);
export default router;
