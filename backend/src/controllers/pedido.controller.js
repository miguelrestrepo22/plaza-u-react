import * as PedidoService from '../services/pedido.service.js';

export const crear = async (req, res) => {
  const pedidos = await PedidoService.crear(req.usuario, req.body);
  res.status(201).json(pedidos); // devuelve una lista: se crea un pedido por cada vendedor
};

export const listar = async (req, res) => {
  res.json(await PedidoService.listar(req.usuario));
};

export const obtener = async (req, res) => {
  res.json(await PedidoService.obtener(req.usuario, req.params.id));
};

export const cambiarEstado = async (req, res) => {
  res.json(await PedidoService.cambiarEstado(req.usuario, req.params.id, req.body.estado));
};
