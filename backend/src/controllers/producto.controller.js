import * as ProductoService from '../services/producto.service.js';

export const listar = async (req, res) => {
  const { total, productos } = await ProductoService.listar(req.query);
  res.set('X-Total-Count', String(total)).json(productos); // el total viaja en un encabezado
};

export const obtener = async (req, res) => {
  res.json(await ProductoService.obtener(req.params.id));
};

export const crear = async (req, res) => {
  const producto = await ProductoService.crear(req.usuario, req.body);
  res.status(201).location(`/api/productos/${producto.id}`).json(producto);
};

export const actualizar = async (req, res) => {
  res.json(await ProductoService.actualizar(req.usuario, req.params.id, req.body));
};

export const eliminar = async (req, res) => {
  await ProductoService.eliminar(req.usuario, req.params.id);
  res.status(204).end();
};
