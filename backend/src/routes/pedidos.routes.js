import { Router } from 'express';
import * as controlador from '../controllers/pedido.controller.js';
import { autenticar } from '../middlewares/auth.js';
import { validar } from '../middlewares/validar.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { reglasCambiarEstado, reglasCrearPedido, reglasIdPedido } from '../validators/pedido.validator.js';

const router = Router();
router.use(autenticar); // todo lo de pedidos exige haber iniciado sesión
router.post('/', reglasCrearPedido, validar, asyncHandler(controlador.crear));
router.get('/', asyncHandler(controlador.listar));
router.get('/:id', reglasIdPedido, validar, asyncHandler(controlador.obtener));
router.put('/:id/estado', reglasCambiarEstado, validar, asyncHandler(controlador.cambiarEstado));
export default router;
