import assert from 'node:assert/strict';
import { after, describe, it } from 'node:test';
import { api, bearer, cerrar, entrar } from './preparar.js';

after(cerrar);

describe('Salud y errores generales', () => {
  it('GET /api/health responde que la API está viva', async () => {
    const r = await api.get('/api/health');
    assert.equal(r.status, 200);
    assert.equal(r.body.estado, 'ok');
  });

  it('una ruta que no existe responde 404 con el formato de error', async () => {
    const r = await api.get('/api/no-existe');
    assert.equal(r.status, 404);
    assert.equal(r.body.error.estado, 404);
    assert.match(r.body.error.mensaje, /No existe la ruta/);
  });

  it('un JSON mal formado responde 400', async () => {
    const r = await api.post('/api/auth/login').set('Content-Type', 'application/json').send('{"email": ');
    assert.equal(r.status, 400);
    assert.match(r.body.error.mensaje, /JSON/);
  });
});

describe('Autenticación', () => {
  it('POST /auth/login con datos correctos devuelve token y usuario sin hash', async () => {
    const r = await api.post('/api/auth/login').send({ email: 'camila@plazau.co', password: 'demo1234' });
    assert.equal(r.status, 200);
    assert.ok(r.body.token);
    assert.equal(r.body.usuario.email, 'camila@plazau.co');
    assert.equal(r.body.usuario.pass_hash, undefined);
    assert.equal(r.body.usuario.passHash, undefined);
  });

  it('POST /auth/login con clave incorrecta responde 401', async () => {
    const r = await api.post('/api/auth/login').send({ email: 'camila@plazau.co', password: 'otra-clave' });
    assert.equal(r.status, 401);
  });

  it('POST /auth/login con un correo que no existe responde 401 con el mismo mensaje', async () => {
    const r = await api.post('/api/auth/login').send({ email: 'nadie@plazau.co', password: 'demo1234' });
    assert.equal(r.status, 401);
    assert.equal(r.body.error.mensaje, 'Correo o contraseña incorrectos');
  });

  it('POST /auth/login sin datos responde 400 con la lista de campos inválidos', async () => {
    const r = await api.post('/api/auth/login').send({});
    assert.equal(r.status, 400);
    assert.ok(r.body.error.detalles.some(d => d.campo === 'email'));
    assert.ok(r.body.error.detalles.some(d => d.campo === 'password'));
  });

  it('POST /auth/registro crea la cuenta y deja iniciar sesión', async () => {
    const r = await api.post('/api/auth/registro').send({
      nombre: 'Ana Torres',
      email: 'Ana@Correo.com',
      password: 'clave12345'
    });
    assert.equal(r.status, 201);
    assert.equal(r.body.usuario.email, 'ana@correo.com'); // el correo se guarda en minúsculas
    assert.equal(r.body.usuario.rol, 'estudiante');
    const login = await api.post('/api/auth/login').send({ email: 'ana@correo.com', password: 'clave12345' });
    assert.equal(login.status, 200);
  });

  it('POST /auth/registro con un correo repetido responde 409', async () => {
    const r = await api.post('/api/auth/registro').send({
      nombre: 'Otra Camila',
      email: 'camila@plazau.co',
      password: 'clave12345'
    });
    assert.equal(r.status, 409);
  });

  it('POST /auth/registro valida nombre, correo y contraseña', async () => {
    const r = await api
      .post('/api/auth/registro')
      .send({ nombre: 'A', email: 'no-es-correo', password: '123' });
    assert.equal(r.status, 400);
    const campos = r.body.error.detalles.map(d => d.campo);
    assert.deepEqual(campos.sort(), ['email', 'nombre', 'password']);
  });

  it('nadie puede registrarse como administrador', async () => {
    const r = await api.post('/api/auth/registro').send({
      nombre: 'Intruso Admin',
      email: 'intruso@correo.com',
      password: 'clave12345',
      rol: 'admin'
    });
    assert.equal(r.status, 201);
    assert.equal(r.body.usuario.rol, 'estudiante');
  });

  it('GET /auth/yo sin token responde 401', async () => {
    assert.equal((await api.get('/api/auth/yo')).status, 401);
  });

  it('GET /auth/yo con un token inventado responde 401', async () => {
    const r = await api.get('/api/auth/yo').set(...bearer('token.falso.123'));
    assert.equal(r.status, 401);
  });

  it('GET /auth/yo con un token válido devuelve los datos de la persona', async () => {
    const token = await entrar('andres@plazau.co');
    const r = await api.get('/api/auth/yo').set(...bearer(token));
    assert.equal(r.status, 200);
    assert.equal(r.body.email, 'andres@plazau.co');
  });
});
