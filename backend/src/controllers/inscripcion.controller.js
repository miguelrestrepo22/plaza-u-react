import * as InscripcionService from '../services/inscripcion.service.js';

export const inscribir = async (req, res) => {
  res.status(201).json(await InscripcionService.inscribir(req.usuario, req.params.id, req.body));
};

export const cancelar = async (req, res) => {
  await InscripcionService.cancelar(req.usuario, req.params.id);
  res.status(204).end();
};

export const listarMias = async (req, res) => {
  res.json(await InscripcionService.listarMias(req.usuario));
};
