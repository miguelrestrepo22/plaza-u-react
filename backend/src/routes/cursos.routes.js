import { Router } from 'express';
import * as controlador from '../controllers/curso.controller.js';
import * as inscripciones from '../controllers/inscripcion.controller.js';
import { autenticar } from '../middlewares/auth.js';
import { validar } from '../middlewares/validar.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  reglasActualizarCurso,
  reglasCrearCurso,
  reglasIdCurso,
  reglasListarCursos
} from '../validators/curso.validator.js';
import { reglasCancelarInscripcion, reglasInscribir } from '../validators/inscripcion.validator.js';

const router = Router();
router.get('/', reglasListarCursos, validar, asyncHandler(controlador.listar));
router.get('/:id', reglasIdCurso, validar, asyncHandler(controlador.obtener));
router.post('/', autenticar, reglasCrearCurso, validar, asyncHandler(controlador.crear));
router.put('/:id', autenticar, reglasActualizarCurso, validar, asyncHandler(controlador.actualizar));
router.delete('/:id', autenticar, reglasIdCurso, validar, asyncHandler(controlador.eliminar));

// La inscripción cuelga del curso: /cursos/:id/inscripcion
router.post('/:id/inscripcion', autenticar, reglasInscribir, validar, asyncHandler(inscripciones.inscribir));
router.delete(
  '/:id/inscripcion',
  autenticar,
  reglasCancelarInscripcion,
  validar,
  asyncHandler(inscripciones.cancelar)
);
export default router;
