import { Router } from 'express';
import * as controlador from '../controllers/producto.controller.js';
import { autenticar } from '../middlewares/auth.js';
import { validar } from '../middlewares/validar.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  reglasActualizarProducto,
  reglasCrearProducto,
  reglasIdProducto,
  reglasListarProductos
} from '../validators/producto.validator.js';

const router = Router();
router.get('/', reglasListarProductos, validar, asyncHandler(controlador.listar));
router.get('/:id', reglasIdProducto, validar, asyncHandler(controlador.obtener));
router.post('/', autenticar, reglasCrearProducto, validar, asyncHandler(controlador.crear));
router.put('/:id', autenticar, reglasActualizarProducto, validar, asyncHandler(controlador.actualizar));
router.delete('/:id', autenticar, reglasIdProducto, validar, asyncHandler(controlador.eliminar));
export default router;
