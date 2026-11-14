import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { api, bearer, cerrar, clienteValido, entrar, productoValido } from './preparar.js';

let camila, andres, valentina, admin;
before(async () => {
  camila = await entrar('camila@plazau.co');
  andres = await entrar('andres@plazau.co');
  valentina = await entrar('valentina@plazau.co');
  admin = await entrar('admin@plazau.co', 'admin123');
});
after(cerrar);

const stock = async id => (await api.get(`/api/productos/${id}`)).body.stock;
const pedir = (token, items, extra = {}) =>
  api
    .post('/api/pedidos')
    .set(...bearer(token))
    .send({ items, cliente: clienteValido, pago: 'Nequi', ...extra });

describe('Crear pedidos: validaciones', () => {
  it('sin sesión responde 401', async () => {
    assert.equal((await api.post('/api/pedidos').send({})).status, 401);
  });

  it('con datos inválidos responde 400 con los campos que fallaron', async () => {
    const r = await pedir(camila, [], {
      cliente: { nombre: 'A', celular: '123', direccion: '' },
      pago: 'Bitcoin'
    });
    assert.equal(r.status, 400);
    const campos = r.body.error.detalles.map(d => d.campo);
    for (const esperado of ['items', 'cliente.nombre', 'cliente.celular', 'cliente.direccion', 'pago']) {
      assert.ok(campos.includes(esperado), `falta ${esperado}`);
    }
  });

  it('un producto que no existe responde 404', async () => {
    assert.equal((await pedir(camila, [{ productoId: 'p999', cantidad: 1 }])).status, 404);
  });

  it('no se pueden comprar los productos propios (409)', async () => {
    const r = await pedir(camila, [{ productoId: 'p1', cantidad: 1 }]); // p1 es de Camila
    assert.equal(r.status, 409);
  });
});

describe('Crear pedidos: stock y comisión', () => {
  it('crea un pedido por vendedor, calcula total y comisión (10 %) y descuenta el stock', async () => {
    const antes2 = await stock('p2'); // oso de Andrés
    const antes3 = await stock('p3'); // brownies de Valentina
    const r = await pedir(camila, [
      { productoId: 'p2', cantidad: 1 },
      { productoId: 'p3', cantidad: 2 }
    ]);
    assert.equal(r.status, 201);
    assert.equal(r.body.length, 2); // dos vendedores, dos pedidos
    const deAndres = r.body.find(p => p.vendedorId === 'u_andres');
    const deValentina = r.body.find(p => p.vendedorId === 'u_valentina');
    assert.equal(deAndres.total, 48000);
    assert.equal(deAndres.comision, 4800);
    assert.equal(deValentina.total, 56000);
    assert.equal(deValentina.comision, 5600);
    assert.match(deAndres.id, /^PU-\d+$/);
    assert.equal(deAndres.estado, 'Nuevo');
    assert.equal(await stock('p2'), antes2 - 1);
    assert.equal(await stock('p3'), antes3 - 2);
  });

  it('si el mismo producto viene repetido, junta las cantidades', async () => {
    const antes = await stock('p4');
    const r = await pedir(camila, [
      { productoId: 'p4', cantidad: 1 },
      { productoId: 'p4', cantidad: 2 }
    ]);
    assert.equal(r.status, 201);
    assert.equal(r.body[0].items[0].cantidad, 3);
    assert.equal(await stock('p4'), antes - 3);
  });

  it('pedir más de lo que hay responde 409 y no descuenta nada', async () => {
    const antes = await stock('p5');
    const r = await pedir(camila, [{ productoId: 'p5', cantidad: antes + 1 }]);
    assert.equal(r.status, 409);
    assert.match(r.body.error.mensaje, /Solo quedan/);
    assert.equal(await stock('p5'), antes);
  });

  it('si una línea falla, no se crea ningún pedido y no se descuenta ninguna (transacción)', async () => {
    const antes8 = await stock('p8');
    const antes6 = await stock('p6');
    const r = await pedir(camila, [
      { productoId: 'p8', cantidad: 1 },
      { productoId: 'p6', cantidad: antes6 + 5 }
    ]);
    assert.equal(r.status, 409);
    assert.equal(await stock('p8'), antes8); // la línea buena tampoco se aplicó
  });

  it('no deja pasar el inventario: el oso tiene 6 unidades en total', async () => {
    const creado = await api
      .post('/api/productos')
      .set(...bearer(andres))
      .send({ ...productoValido, nombre: 'Producto de 3 unidades', stock: 3 });
    const id = creado.body.id;
    assert.equal((await pedir(camila, [{ productoId: id, cantidad: 3 }])).status, 201);
    const r = await pedir(valentina, [{ productoId: id, cantidad: 1 }]);
    assert.equal(r.status, 409);
    assert.match(r.body.error.mensaje, /agotado/);
  });

  it('dos compras simultáneas del último producto: solo una gana', async () => {
    const creado = await api
      .post('/api/productos')
      .set(...bearer(andres))
      .send({ ...productoValido, nombre: 'Última unidad', stock: 1 });
    const id = creado.body.id;
    const [a, b] = await Promise.all([
      pedir(camila, [{ productoId: id, cantidad: 1 }]),
      pedir(valentina, [{ productoId: id, cantidad: 1 }])
    ]);
    assert.deepEqual([a.status, b.status].sort(), [201, 409]);
    assert.equal(await stock(id), 0);
  });
});

describe('Estados de un pedido', () => {
  let pedido;
  const crear = async () => {
    const r = await pedir(camila, [{ productoId: 'p7', cantidad: 2 }]); // p7 es de Laura
    return r.body[0];
  };
  let laura;
  before(async () => {
    laura = await entrar('laura@plazau.co');
    pedido = await crear();
  });

  it('el comprador y el vendedor ven el pedido; un tercero recibe 403', async () => {
    assert.equal((await api.get(`/api/pedidos/${pedido.id}`).set(...bearer(camila))).status, 200);
    assert.equal((await api.get(`/api/pedidos/${pedido.id}`).set(...bearer(laura))).status, 200);
    assert.equal((await api.get(`/api/pedidos/${pedido.id}`).set(...bearer(andres))).status, 403);
    assert.equal((await api.get('/api/pedidos/PU-99999').set(...bearer(admin))).status, 404);
  });

  it('GET /pedidos lista solo los míos, y el administrador ve todos', async () => {
    const mios = await api.get('/api/pedidos').set(...bearer(andres));
    assert.ok(mios.body.every(p => p.compradorId === 'u_andres' || p.vendedorId === 'u_andres'));
    const todos = await api.get('/api/pedidos').set(...bearer(admin));
    assert.ok(todos.body.length > mios.body.length);
  });

  it('el comprador no puede avanzar el pedido (403)', async () => {
    const r = await api
      .put(`/api/pedidos/${pedido.id}/estado`)
      .set(...bearer(camila))
      .send({ estado: 'Preparando' });
    assert.equal(r.status, 403);
  });

  it('un estado que no existe responde 400', async () => {
    const r = await api
      .put(`/api/pedidos/${pedido.id}/estado`)
      .set(...bearer(laura))
      .send({ estado: 'Volando' });
    assert.equal(r.status, 400);
  });

  it('no se puede saltar pasos: de Nuevo a Entregado responde 409', async () => {
    const r = await api
      .put(`/api/pedidos/${pedido.id}/estado`)
      .set(...bearer(laura))
      .send({ estado: 'Entregado' });
    assert.equal(r.status, 409);
    assert.match(r.body.error.mensaje, /Preparando/);
  });

  it('el vendedor avanza paso a paso hasta Entregado', async () => {
    for (const estado of ['Preparando', 'En camino', 'Entregado']) {
      const r = await api
        .put(`/api/pedidos/${pedido.id}/estado`)
        .set(...bearer(laura))
        .send({ estado });
      assert.equal(r.status, 200);
      assert.equal(r.body.estado, estado);
    }
  });

  it('un pedido Entregado ya no se puede cambiar ni cancelar (409)', async () => {
    const r = await api
      .put(`/api/pedidos/${pedido.id}/estado`)
      .set(...bearer(laura))
      .send({ estado: 'Cancelado' });
    assert.equal(r.status, 409);
  });

  it('el comprador cancela mientras está Nuevo y se devuelve el stock', async () => {
    const antes = await stock('p9'); // p9 es de Mariana
    const creado = (await pedir(camila, [{ productoId: 'p9', cantidad: 4 }])).body[0];
    assert.equal(await stock('p9'), antes - 4);
    const r = await api
      .put(`/api/pedidos/${creado.id}/estado`)
      .set(...bearer(camila))
      .send({ estado: 'Cancelado' });
    assert.equal(r.status, 200);
    assert.equal(r.body.estado, 'Cancelado');
    assert.equal(await stock('p9'), antes);
  });

  it('el comprador ya no puede cancelar cuando el pedido pasó a Preparando (403), pero el vendedor sí', async () => {
    const mariana = await entrar('mariana@plazau.co');
    const creado = (await pedir(camila, [{ productoId: 'p6', cantidad: 1 }])).body[0];
    await api
      .put(`/api/pedidos/${creado.id}/estado`)
      .set(...bearer(mariana))
      .send({ estado: 'Preparando' });
    const comprador = await api
      .put(`/api/pedidos/${creado.id}/estado`)
      .set(...bearer(camila))
      .send({ estado: 'Cancelado' });
    assert.equal(comprador.status, 403);
    const vendedor = await api
      .put(`/api/pedidos/${creado.id}/estado`)
      .set(...bearer(mariana))
      .send({ estado: 'Cancelado' });
    assert.equal(vendedor.status, 200);
  });
});
