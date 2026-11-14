import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { api, bearer, cerrar, clienteValido, entrar } from './preparar.js';

let camila, admin;
before(async () => {
  camila = await entrar('camila@plazau.co');
  admin = await entrar('admin@plazau.co', 'admin123');
});
after(cerrar);

describe('Rutas públicas', () => {
  it('GET /vendedores lista a los estudiantes sin correo ni WhatsApp', async () => {
    const r = await api.get('/api/vendedores');
    assert.equal(r.status, 200);
    assert.equal(r.body.length, 7);
    assert.ok(r.body.every(v => v.email === undefined && v.whatsapp === undefined));
  });

  it('GET /config devuelve la comisión vigente (10 %)', async () => {
    const r = await api.get('/api/config');
    assert.equal(r.body.comisionPorcentaje, 10);
  });
});

describe('Comisión configurable (solo administrador)', () => {
  it('sin sesión responde 401 y con una cuenta de estudiante 403', async () => {
    assert.equal((await api.put('/api/config').send({ comisionPorcentaje: 5 })).status, 401);
    assert.equal(
      (
        await api
          .put('/api/config')
          .set(...bearer(camila))
          .send({ comisionPorcentaje: 5 })
      ).status,
      403
    );
  });

  it('un valor fuera de 0 a 20 responde 400', async () => {
    assert.equal(
      (
        await api
          .put('/api/config')
          .set(...bearer(admin))
          .send({ comisionPorcentaje: 25 })
      ).status,
      400
    );
    assert.equal(
      (
        await api
          .put('/api/config')
          .set(...bearer(admin))
          .send({ comisionPorcentaje: -1 })
      ).status,
      400
    );
  });

  it('el administrador la cambia y los pedidos nuevos usan el porcentaje nuevo', async () => {
    const cambio = await api
      .put('/api/config')
      .set(...bearer(admin))
      .send({ comisionPorcentaje: 5 });
    assert.equal(cambio.status, 200);
    assert.equal(cambio.body.comisionPorcentaje, 5);
    const r = await api
      .post('/api/pedidos')
      .set(...bearer(camila))
      .send({
        items: [{ productoId: 'p2', cantidad: 1 }],
        cliente: clienteValido,
        pago: 'Contra entrega'
      });
    assert.equal(r.body[0].comision, 2400); // 5 % de 48.000
  });
});

describe('Moderación de cuentas (solo administrador)', () => {
  it('GET /usuarios: el administrador ve las cuentas, el estudiante recibe 403', async () => {
    const r = await api.get('/api/usuarios').set(...bearer(admin));
    assert.equal(r.status, 200);
    assert.equal(r.body.length, 8);
    assert.equal((await api.get('/api/usuarios').set(...bearer(camila))).status, 403);
  });

  it('DELETE /usuarios/:id elimina la cuenta y también sus productos', async () => {
    assert.ok((await api.get('/api/productos')).body.some(p => p.vendedorId === 'u_mariana'));
    assert.equal((await api.delete('/api/usuarios/u_mariana').set(...bearer(admin))).status, 204);
    assert.ok(!(await api.get('/api/productos')).body.some(p => p.vendedorId === 'u_mariana'));
  });

  it('un token de una cuenta eliminada deja de servir (401)', async () => {
    const mariana = await api
      .post('/api/auth/login')
      .send({ email: 'mariana@plazau.co', password: 'demo1234' });
    assert.equal(mariana.status, 401); // ya no puede ni iniciar sesión
  });

  it('no se puede eliminar a un administrador (409) ni a alguien que no existe (404)', async () => {
    assert.equal((await api.delete('/api/usuarios/u_admin').set(...bearer(admin))).status, 409);
    assert.equal((await api.delete('/api/usuarios/u_fantasma').set(...bearer(admin))).status, 404);
  });

  it('un estudiante no puede eliminar cuentas (403)', async () => {
    assert.equal((await api.delete('/api/usuarios/u_laura').set(...bearer(camila))).status, 403);
  });
});
