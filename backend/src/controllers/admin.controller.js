import * as ConfigService from '../services/config.service.js';
import * as UsuarioService from '../services/usuario.service.js';

export const verConfig = async (req, res) => {
  res.json(await ConfigService.obtener());
};

export const cambiarConfig = async (req, res) => {
  res.json(await ConfigService.actualizar(req.body));
};

export const listarVendedores = async (req, res) => {
  res.json(await UsuarioService.listarVendedores());
};

export const listarUsuarios = async (req, res) => {
  res.json(await UsuarioService.listar());
};

export const eliminarUsuario = async (req, res) => {
  await UsuarioService.eliminar(req.usuario, req.params.id);
  res.status(204).end();
};
