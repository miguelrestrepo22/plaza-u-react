// Prepara el entorno de pruebas: base de datos en memoria con los datos de ejemplo y la app lista.
// Cada archivo de pruebas corre en su propio proceso, así que cada uno tiene su propia base.
process.env.NODE_ENV = 'test';
process.env.PGLITE_DIR = 'memory';
process.env.JWT_SECRET = 'secreto-de-pruebas';

const { crearApp } = await import('../src/app.js');
const { conectar, cerrar } = await import('../src/config/db.js');
const { sembrarSiEstaVacia } = await import('../src/db/sembrar.js');
const supertest = (await import('supertest')).default;

await conectar();
await sembrarSiEstaVacia();

export const api = supertest(crearApp());
export { cerrar };

// Inicia sesión y devuelve el encabezado listo para usar: .set(...auth(token))
export async function entrar(email, password = 'demo1234') {
  const r = await api.post('/api/auth/login').send({ email, password });
  return r.body.token;
}
export const bearer = token => ['Authorization', `Bearer ${token}`];

export const clienteValido = {
  nombre: 'Ana Torres',
  celular: '3001234567',
  direccion: 'Bloque 5, salón 302'
};
export const productoValido = {
  nombre: 'Galletas de avena y miel',
  categoria: 'Comida',
  precio: 12000,
  stock: 25,
  descripcion: 'Galletas caseras de avena con miel, bolsa de 8 unidades.'
};
export const cursoValido = {
  titulo: 'Fotografía con el celular',
  categoria: 'Diseño',
  nivel: 'Principiante',
  precio: 35000,
  cupos: 15,
  horario: 'Sábados, 10:00 a. m. · Bloque 3',
  duracion: '3 sesiones de 2 horas',
  descripcion: 'Aprende encuadre, luz y edición básica para tus fotos de producto.',
  temario: ['Encuadre y luz', 'Edición básica']
};
