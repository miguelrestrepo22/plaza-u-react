import { Router } from 'express';
import * as controlador from '../controllers/auth.controller.js';
import { autenticar } from '../middlewares/auth.js';
import { validar } from '../middlewares/validar.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { reglasLogin, reglasRegistro } from '../validators/auth.validator.js';

// Cada ruta encadena: reglas de validación → validar → (autenticar) → controlador
const router = Router();
router.post('/registro', reglasRegistro, validar, asyncHandler(controlador.registrar));
router.post('/login', reglasLogin, validar, asyncHandler(controlador.iniciarSesion));
router.get('/yo', autenticar, asyncHandler(controlador.perfil));
export default router;
