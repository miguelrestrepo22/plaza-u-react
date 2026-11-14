import * as CursoService from '../services/curso.service.js';

export const listar = async (req, res) => {
  const { total, cursos } = await CursoService.listar(req.query);
  res.set('X-Total-Count', String(total)).json(cursos);
};

export const obtener = async (req, res) => {
  res.json(await CursoService.obtener(req.params.id));
};

export const crear = async (req, res) => {
  const curso = await CursoService.crear(req.usuario, req.body);
  res.status(201).location(`/api/cursos/${curso.id}`).json(curso);
};

export const actualizar = async (req, res) => {
  res.json(await CursoService.actualizar(req.usuario, req.params.id, req.body));
};

export const eliminar = async (req, res) => {
  await CursoService.eliminar(req.usuario, req.params.id);
  res.status(204).end();
};
