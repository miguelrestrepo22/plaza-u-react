import { ESTADOS_PEDIDO } from '../config/constantes.js';
import { transaccion } from '../config/db.js';
import * as Pedido from '../models/pedido.model.js';
import * as Producto from '../models/producto.model.js';
import { AppError, noEncontrado } from '../utils/AppError.js';
import { pedidoApi } from '../utils/mapeos.js';
import { comisionActual } from './config.service.js';

// Si el mismo producto viene dos veces en el pedido, junta las cantidades en una sola línea
function fusionarLineas(items) {
  const mapa = new Map();
  for (const { productoId, cantidad } of items) {
    mapa.set(productoId, (mapa.get(productoId) ?? 0) + cantidad);
  }
  return [...mapa].map(([productoId, cantidad]) => ({ productoId, cantidad }));
}

// Crea los pedidos de un carrito. Todo ocurre en UNA transacción: o se crean todos los pedidos
// y se descuenta todo el stock, o no pasa nada. Se crea un pedido por cada vendedor.
export async function crear(usuario, { items, cliente, pago }) {
  const creados = await transaccion(async db => {
    const lineas = fusionarLineas(items);
    const productos = await Producto.bloquearVarios(
      lineas.map(l => l.productoId),
      db
    );
    const porId = new Map(productos.map(p => [p.id, p]));

    // 1) Se revisa todo antes de tocar nada
    for (const { productoId, cantidad } of lineas) {
      const producto = porId.get(productoId);
      if (!producto) throw new AppError(404, `El producto ${productoId} no existe`);
      if (producto.owner_id === usuario.id) {
        throw new AppError(409, 'No puedes comprar tus propios productos');
      }
      if (cantidad > producto.stock) {
        throw new AppError(
          409,
          producto.stock === 0
            ? `«${producto.nombre}» está agotado`
            : `Solo quedan ${producto.stock} unidades de «${producto.nombre}»`
        );
      }
    }

    // 2) Se agrupan las líneas por vendedor
    const porVendedor = new Map();
    for (const { productoId, cantidad } of lineas) {
      const producto = porId.get(productoId);
      const lista = porVendedor.get(producto.owner_id) ?? [];
      lista.push({ producto, cantidad });
      porVendedor.set(producto.owner_id, lista);
    }

    // 3) Se crea un pedido por vendedor y se descuenta el stock
    const tasa = await comisionActual(db);
    const filas = [];
    for (const [vendedorId, lista] of porVendedor) {
      const itemsPedido = lista.map(({ producto, cantidad }) => ({
        productoId: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad,
        foto: producto.imagen
      }));
      const total = itemsPedido.reduce((suma, i) => suma + i.precio * i.cantidad, 0);
      const numero = await Pedido.siguienteNumero(db);
      filas.push(
        await Pedido.crear(
          {
            id: `PU-${numero}`,
            compradorId: usuario.id,
            vendedorId,
            items: itemsPedido,
            total,
            comision: Math.round((total * tasa) / 100), // la comisión queda guardada en el pedido
            pago,
            cliente
          },
          db
        )
      );
      for (const { producto, cantidad } of lista) {
        await Producto.ajustarStock(producto.id, -cantidad, db);
      }
    }
    return filas;
  });
  return creados.map(pedidoApi);
}

export async function listar(usuario) {
  const filas = usuario.rol === 'admin' ? await Pedido.listarTodos() : await Pedido.listarDe(usuario.id);
  return filas.map(pedidoApi);
}

export async function obtener(usuario, id) {
  const fila = await Pedido.buscarPorId(id);
  if (!fila) throw noEncontrado('Pedido');
  const involucrado = fila.comprador_id === usuario.id || fila.vendedor_id === usuario.id;
  if (usuario.rol !== 'admin' && !involucrado) throw new AppError(403, 'Este pedido no es tuyo');
  return pedidoApi(fila);
}

// Reglas de los estados:
//  - Se avanza de a un paso: Nuevo → Preparando → En camino → Entregado (solo vendedor o administrador).
//  - Se puede cancelar: vendedor o admin en cualquier momento; el comprador solo si sigue en "Nuevo".
//  - Al cancelar se devuelve el stock. Un pedido Entregado o Cancelado ya no cambia.
export async function cambiarEstado(usuario, id, estado) {
  return transaccion(async db => {
    const pedido = await Pedido.buscarYBloquear(id, db);
    if (!pedido) throw noEncontrado('Pedido');

    const esAdmin = usuario.rol === 'admin';
    const esVendedor = pedido.vendedor_id === usuario.id;
    const esComprador = pedido.comprador_id === usuario.id;
    if (!esAdmin && !esVendedor && !esComprador) throw new AppError(403, 'Este pedido no es tuyo');

    if (pedido.estado === estado) return pedidoApi(pedido); // no hay nada que cambiar
    if (['Entregado', 'Cancelado'].includes(pedido.estado)) {
      throw new AppError(409, `El pedido ya está ${pedido.estado.toLowerCase()} y no se puede modificar`);
    }

    if (estado === 'Cancelado') {
      if (!esAdmin && !esVendedor && pedido.estado !== 'Nuevo') {
        throw new AppError(403, 'El comprador solo puede cancelar mientras el pedido está en estado Nuevo');
      }
      for (const item of pedido.items) {
        await Producto.ajustarStock(item.productoId, item.cantidad, db); // se devuelve el inventario
      }
    } else {
      if (!esAdmin && !esVendedor) {
        throw new AppError(403, 'Solo el vendedor o el administrador pueden avanzar el pedido');
      }
      const siguiente = ESTADOS_PEDIDO[ESTADOS_PEDIDO.indexOf(pedido.estado) + 1];
      if (estado !== siguiente) {
        throw new AppError(409, `Desde «${pedido.estado}» solo se puede pasar a «${siguiente}»`);
      }
    }
    return pedidoApi(await Pedido.actualizarEstado(id, estado, db));
  });
}
