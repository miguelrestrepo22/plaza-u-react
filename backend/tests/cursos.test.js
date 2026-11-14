import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { api, bearer, cerrar, cursoValido, entrar } from './preparar.js';

let camila, daniel, andres;
before(async () => {
  camila = await entrar('camila@plazau.co');
  daniel = await entrar('daniel@plazau.co');
  andres = await entrar('andres@plazau.co');
});
after(cerrar);

describe('Cursos: lectura', () => {
  it('lista los 8 cursos', async () => {
    const r = await api.get('/api/cursos');
    assert.equal(r.status, 200);
    assert.equal(r.body.length, 8);
    assert.ok(Array.isArray(r.body[0].temario));
  });

  it('filtra por nivel', async () => {
    const todos = (await api.get('/api/cursos')).body;
    const r = await api.get('/api/cursos').query({ nivel: 'Principiante' });
    assert.equal(r.body.length, todos.filter(c => c.nivel === 'Principiante').length);
    assert.ok(r.body.length > 0 && r.body.length < 8);
  });

  it('busca por texto', async () => {
    const r = await api.get('/api/cursos').query({ q: 'guitarra' });
    assert.equal(r.body.length, 1);
  });

  it('GET /cursos/:id devuelve el curso o 404', async () => {
    assert.equal((await api.get('/api/cursos/c1')).status, 200);
    assert.equal((await api.get('/api/cursos/c999')).status, 404);
  });
});

describe('Cursos: POST, PUT y DELETE', () => {
  let id;

  it('POST sin sesión responde 401', async () => {
    assert.equal((await api.post('/api/cursos').send(cursoValido)).status, 401);
  });

  it('POST con datos inválidos responde 400', async () => {
    const r = await api
      .post('/api/cursos')
      .set(...bearer(camila))
      .send({ ...cursoValido, nivel: 'Experto', cupos: -1 });
    assert.equal(r.status, 400);
    assert.deepEqual(r.body.error.detalles.map(d => d.campo).sort(), ['cupos', 'nivel']);
  });

  it('POST crea el curso y quien lo crea queda como instructor', async () => {
    const r = await api
      .post('/api/cursos')
      .set(...bearer(camila))
      .send(cursoValido);
    assert.equal(r.status, 201);
    assert.equal(r.body.instructorId, 'u_camila');
    id = r.body.id;
  });

  it('PUT del instructor actualiza el curso', async () => {
    const r = await api
      .put(`/api/cursos/${id}`)
      .set(...bearer(camila))
      .send({ ...cursoValido, cupos: 12 });
    assert.equal(r.status, 200);
    assert.equal(r.body.cupos, 12);
  });

  it('PUT de otra persona responde 403', async () => {
    assert.equal(
      (
        await api
          .put(`/api/cursos/${id}`)
          .set(...bearer(andres))
          .send(cursoValido)
      ).status,
      403
    );
  });

  it('DELETE del instructor responde 204', async () => {
    assert.equal((await api.delete(`/api/cursos/${id}`).set(...bearer(camila))).status, 204);
    assert.equal((await api.get(`/api/cursos/${id}`)).status, 404);
  });
});

describe('Inscripciones', () => {
  const cupos = async id => (await api.get(`/api/cursos/${id}`)).body.cupos;

  it('inscribirse baja un cupo y la inscripción aparece en /inscripciones', async () => {
    const antes = await cupos('c1');
    const r = await api
      .post('/api/cursos/c1/inscripcion')
      .set(...bearer(camila))
      .send({ pago: 'Nequi' });
    assert.equal(r.status, 201);
    assert.equal(r.body.comision, Math.round((r.body.precio * 10) / 100)); // 10 % por defecto
    assert.equal(await cupos('c1'), antes - 1);
    const mias = await api.get('/api/inscripciones').set(...bearer(camila));
    assert.equal(mias.body.length, 1);
    assert.equal(mias.body[0].curso.id, 'c1');
  });

  it('no se puede inscribir dos veces al mismo curso (409)', async () => {
    const r = await api
      .post('/api/cursos/c1/inscripcion')
      .set(...bearer(camila))
      .send({});
    assert.equal(r.status, 409);
  });

  it('el instructor no puede inscribirse a su propio curso (409)', async () => {
    assert.equal(
      (
        await api
          .post('/api/cursos/c1/inscripcion')
          .set(...bearer(daniel))
          .send({})
      ).status,
      409
    );
  });

  it('un curso que no existe responde 404, y sin sesión 401', async () => {
    assert.equal(
      (
        await api
          .post('/api/cursos/c999/inscripcion')
          .set(...bearer(camila))
          .send({})
      ).status,
      404
    );
    assert.equal((await api.post('/api/cursos/c1/inscripcion').send({})).status, 401);
  });

  it('una forma de pago inválida responde 400', async () => {
    assert.equal(
      (
        await api
          .post('/api/cursos/c2/inscripcion')
          .set(...bearer(camila))
          .send({ pago: 'Bitcoin' })
      ).status,
      400
    );
  });

  it('cuando se acaban los cupos, la siguiente persona recibe 409', async () => {
    const creado = await api
      .post('/api/cursos')
      .set(...bearer(daniel))
      .send({ ...cursoValido, cupos: 1 });
    const id = creado.body.id;
    assert.equal(
      (
        await api
          .post(`/api/cursos/${id}/inscripcion`)
          .set(...bearer(camila))
          .send({})
      ).status,
      201
    );
    const r = await api
      .post(`/api/cursos/${id}/inscripcion`)
      .set(...bearer(andres))
      .send({});
    assert.equal(r.status, 409);
    assert.match(r.body.error.mensaje, /cupos/);
  });

  it('cancelar la inscripción devuelve el cupo', async () => {
    const antes = await cupos('c1');
    assert.equal((await api.delete('/api/cursos/c1/inscripcion').set(...bearer(camila))).status, 204);
    assert.equal(await cupos('c1'), antes + 1);
    assert.equal((await api.delete('/api/cursos/c1/inscripcion').set(...bearer(camila))).status, 404);
  });
});
