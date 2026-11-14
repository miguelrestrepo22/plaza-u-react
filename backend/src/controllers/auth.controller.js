import * as AuthService from '../services/auth.service.js';

// Los controladores son delgados: leen la petición, llaman al servicio y arman la respuesta HTTP.
export const registrar = async (req, res) => {
  res.status(201).json(await AuthService.registrar(req.body));
};

export const iniciarSesion = async (req, res) => {
  res.json(await AuthService.iniciarSesion(req.body));
};

export const perfil = async (req, res) => {
  res.json(await AuthService.perfil(req.usuario.id));
};
