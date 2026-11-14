import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { api, bearer, cerrar, entrar, productoValido } from './preparar.js';

let camila, andres, admin;
before(async () => {
  camila = await entrar('camila@plazau.co');
  andres = await entrar('andres@plazau.co');
  admin = await entrar('admin@plazau.co', 'admin123');
});
after(cerrar);

describe('GET /productos', () => {
  it('lista los 12 productos y envía el total en X-Total-Count', async () => {
    const r = await api.get('/api/productos');
    assert.equal(r.status, 200);
    assert.equal(r.body.length, 12);
    assert.equal(r.headers['x-total-count'], '12');
    assert.ok(r.body[0].foto.startsWith('/fotos/'));
  });

  it('filtra por categoría', async () => {
    const r = await api.get('/api/productos').query({ categoria: 'Comida' });
    assert.equal(r.body.length, 3);
    assert.ok(r.body.every(p => p.categoria === 'Comida'));
  });

  it('busca sin importar tildes ni mayúsculas ("cafe" encuentra el café)', async () => {
    const r = await api.get('/api/productos').query({ q: 'CAFE' });
    assert.equal(r.body.length, 1);
    assert.match(r.body[0].nombre, /Café/);
  });

  it('ordena por precio de menor a mayor', async () => {
    const r = await api.get('/api/productos').query({ orden: 'precio_asc' });
    const precios = r.body.map(p => p.precio);
    assert.deepEqual(
      precios,
      [...precios].sort((a, b) => a - b)
    );
  });

  it('pagina con limite y desde, y el total sigue siendo 12', async () => {
    const r = await api.get('/api/productos').query({ limite: 5, desde: 10 });
    assert.equal(r.body.length, 2);
    assert.equal(r.headers['x-total-count'], '12');
  });

  it('rechaza parámetros inválidos con 400', async () => {
    assert.equal((await api.get('/api/productos').query({ limite: 0 })).status, 400);
    assert.equal((await api.get('/api/productos').query({ orden: 'al-azar' })).status, 400);
    assert.equal((await api.get('/api/productos').query({ categoria: 'Autos' })).status, 400);
  });
});

describe('GET /productos/:id', () => {
  it('devuelve un producto', async () => {
    const r = await api.get('/api/productos/p2');
    assert.equal(r.status, 200);
    assert.equal(r.body.stock, 6);
  });
  it('responde 404 si no existe', async () => {
    assert.equal((await api.get('/api/productos/p999')).status, 404);
  });
});

describe('POST, PUT y DELETE de productos', () => {
  let id;

  it('POST sin sesión responde 401', async () => {
    assert.equal((await api.post('/api/productos').send(productoValido)).status, 401);
  });

  it('POST con datos inválidos responde 400 y dice qué campos fallaron', async () => {
    const r = await api
      .post('/api/productos')
      .set(...bearer(camila))
      .send({
        ...productoValido,
        precio: 100,
        categoria: 'Autos',
        nombre: 'A'
      });
    assert.equal(r.status, 400);
    assert.deepEqual(r.body.error.detalles.map(d => d.campo).sort(), ['categoria', 'nombre', 'precio']);
  });

  it('POST crea el producto, queda a nombre de quien tiene la sesión y trae Location', async () => {
    const r = await api
      .post('/api/productos')
      .set(...bearer(camila))
      .send(productoValido);
    assert.equal(r.status, 201);
    assert.equal(r.body.vendedorId, 'u_camila');
    assert.equal(r.headers.location, `/api/productos/${r.body.id}`);
    id = r.body.id;
    assert.equal((await api.get(`/api/productos/${id}`)).status, 200);
  });

  it('PUT del dueño actualiza el producto', async () => {
    const r = await api
      .put(`/api/productos/${id}`)
      .set(...bearer(camila))
      .send({ ...productoValido, precio: 13500, stock: 10 });
    assert.equal(r.status, 200);
    assert.equal(r.body.precio, 13500);
    assert.equal(r.body.stock, 10);
  });

  it('PUT de otra persona responde 403', async () => {
    const r = await api
      .put(`/api/productos/${id}`)
      .set(...bearer(andres))
      .send(productoValido);
    assert.equal(r.status, 403);
  });

  it('PUT de un producto que no existe responde 404', async () => {
    assert.equal(
      (
        await api
          .put('/api/productos/p999')
          .set(...bearer(camila))
          .send(productoValido)
      ).status,
      404
    );
  });

  it('PUT del administrador sí puede modificar el producto de otra persona', async () => {
    const r = await api
      .put(`/api/productos/${id}`)
      .set(...bearer(admin))
      .send({ ...productoValido, nombre: 'Galletas (revisadas)' });
    assert.equal(r.status, 200);
  });

  it('DELETE de otra persona responde 403 y el producto sigue ahí', async () => {
    assert.equal((await api.delete(`/api/productos/${id}`).set(...bearer(andres))).status, 403);
    assert.equal((await api.get(`/api/productos/${id}`)).status, 200);
  });

  it('DELETE del dueño responde 204 y después el producto da 404', async () => {
    assert.equal((await api.delete(`/api/productos/${id}`).set(...bearer(camila))).status, 204);
    assert.equal((await api.get(`/api/productos/${id}`)).status, 404);
  });
});
