import { Router } from 'express';
import * as controlador from '../controllers/admin.controller.js';
import * as inscripciones from '../controllers/inscripcion.controller.js';
import { autenticar, exigirRol } from '../middlewares/auth.js';
import { validar } from '../middlewares/validar.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { reglasConfig, reglasIdUsuario } from '../validators/admin.validator.js';

const router = Router();

// Públicas
router.get('/vendedores', asyncHandler(controlador.listarVendedores));
router.get('/config', asyncHandler(controlador.verConfig));

// Con sesión
router.get('/inscripciones', autenticar, asyncHandler(inscripciones.listarMias));

// Solo administrador
router.put(
  '/config',
  autenticar,
  exigirRol('admin'),
  reglasConfig,
  validar,
  asyncHandler(controlador.cambiarConfig)
);
router.get('/usuarios', autenticar, exigirRol('admin'), asyncHandler(controlador.listarUsuarios));
router.delete(
  '/usuarios/:id',
  autenticar,
  exigirRol('admin'),
  reglasIdUsuario,
  validar,
  asyncHandler(controlador.eliminarUsuario)
);
export default router;
