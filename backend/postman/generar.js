// Genera la colección de Postman (con pruebas incluidas) y el entorno:  npm run postman
// Se importa en Postman con File > Import, o se ejecuta por consola con Newman.
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = '{{baseUrl}}';
const guion = lineas => ({ type: 'text/javascript', exec: lineas });

// Arma una petición de la colección. "pruebas" son líneas de JavaScript que Postman ejecuta al recibir la respuesta.
function peticion(nombre, metodo, ruta, { token, cuerpo, pruebas = [], antes = [], consulta } = {}) {
  const header = [];
  if (cuerpo) header.push({ key: 'Content-Type', value: 'application/json' });
  if (token) header.push({ key: 'Authorization', value: `Bearer {{${token}}}` });
  const url = { raw: `${BASE}${ruta}`, host: ['{{baseUrl}}'], path: ruta.split('/').filter(Boolean) };
  if (consulta) {
    url.query = Object.entries(consulta).map(([key, value]) => ({ key, value }));
    url.raw +=
      '?' +
      Object.entries(consulta)
        .map(([k, v]) => `${k}=${v}`)
        .join('&');
  }
  const item = {
    name: nombre,
    request: {
      method: metodo,
      header,
      url,
      ...(cuerpo ? { body: { mode: 'raw', raw: JSON.stringify(cuerpo, null, 2) } } : {})
    },
    event: [{ listen: 'test', script: guion(pruebas) }]
  };
  if (antes.length) item.event.unshift({ listen: 'prerequest', script: guion(antes) });
  return item;
}

const estado = (codigo, texto = `Responde ${codigo}`) =>
  `pm.test(${JSON.stringify(texto)}, () => pm.response.to.have.status(${codigo}));`;
const guardar = (variable, expresion) =>
  `pm.collectionVariables.set(${JSON.stringify(variable)}, ${expresion});`;

const producto = {
  nombre: 'Galletas de avena y miel',
  categoria: 'Comida',
  precio: 12000,
  stock: 25,
  descripcion: 'Galletas caseras de avena con miel, bolsa de 8 unidades.'
};
const curso = {
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
const cliente = {
  nombre: 'Ana Torres',
  celular: '3001234567',
  direccion: 'Bloque 5, salón 302',
  notas: 'Salgo a las 2 p. m.'
};

const carpetas = [
  {
    name: '1. Salud',
    item: [
      peticion('GET /health', 'GET', '/health', {
        pruebas: [
          estado(200),
          "pm.test('estado ok', () => pm.expect(pm.response.json().estado).to.eql('ok'));"
        ]
      })
    ]
  },
  {
    name: '2. Autenticación',
    item: [
      peticion('POST /auth/registro (cuenta nueva)', 'POST', '/auth/registro', {
        antes: ["pm.collectionVariables.set('emailNuevo', 'prueba' + Date.now() + '@correo.com');"],
        cuerpo: {
          nombre: 'Ana Torres',
          email: '{{emailNuevo}}',
          password: 'clave12345',
          carrera: 'Diseño gráfico'
        },
        pruebas: [
          estado(201, 'Crea la cuenta (201)'),
          "pm.test('devuelve token y rol estudiante', () => { const j = pm.response.json(); pm.expect(j.token).to.be.a('string'); pm.expect(j.usuario.rol).to.eql('estudiante'); });",
          guardar('usuarioNuevoId', 'pm.response.json().usuario.id')
        ]
      }),
      peticion('POST /auth/registro (correo repetido)', 'POST', '/auth/registro', {
        cuerpo: { nombre: 'Ana Torres', email: '{{emailNuevo}}', password: 'clave12345' },
        pruebas: [estado(409, 'Correo repetido: 409')]
      }),
      peticion('POST /auth/registro (datos inválidos)', 'POST', '/auth/registro', {
        cuerpo: { nombre: 'A', email: 'no-es-correo', password: '123' },
        pruebas: [
          estado(400, 'Datos inválidos: 400'),
          "pm.test('lista los campos con error', () => pm.expect(pm.response.json().error.detalles.length).to.eql(3));"
        ]
      }),
      peticion('POST /auth/login (Camila)', 'POST', '/auth/login', {
        cuerpo: { email: 'camila@plazau.co', password: 'demo1234' },
        pruebas: [estado(200), guardar('tokenCamila', 'pm.response.json().token')]
      }),
      peticion('POST /auth/login (Andrés)', 'POST', '/auth/login', {
        cuerpo: { email: 'andres@plazau.co', password: 'demo1234' },
        pruebas: [estado(200), guardar('tokenAndres', 'pm.response.json().token')]
      }),
      peticion('POST /auth/login (administrador)', 'POST', '/auth/login', {
        cuerpo: { email: 'admin@plazau.co', password: 'admin123' },
        pruebas: [estado(200), guardar('tokenAdmin', 'pm.response.json().token')]
      }),
      peticion('POST /auth/login (clave incorrecta)', 'POST', '/auth/login', {
        cuerpo: { email: 'camila@plazau.co', password: 'otra-clave' },
        pruebas: [estado(401, 'Clave incorrecta: 401')]
      }),
      peticion('GET /auth/yo (con token)', 'GET', '/auth/yo', {
        token: 'tokenCamila',
        pruebas: [
          estado(200),
          "pm.test('es Camila', () => pm.expect(pm.response.json().email).to.eql('camila@plazau.co'));"
        ]
      }),
      peticion('GET /auth/yo (sin token)', 'GET', '/auth/yo', { pruebas: [estado(401, 'Sin token: 401')] })
    ]
  },
  {
    name: '3. Productos',
    item: [
      peticion('GET /productos', 'GET', '/productos', {
        pruebas: [
          estado(200),
          "pm.test('al menos 12 productos y total en el encabezado', () => { pm.expect(pm.response.json().length).to.be.at.least(12); pm.expect(pm.response.headers.get('X-Total-Count')).to.exist; });"
        ]
      }),
      peticion('GET /productos?categoria=Comida', 'GET', '/productos', {
        consulta: { categoria: 'Comida' },
        pruebas: [
          estado(200),
          "pm.test('todos son de Comida', () => pm.expect(pm.response.json().every(p => p.categoria === 'Comida')).to.be.true);"
        ]
      }),
      peticion('GET /productos?q=cafe (sin tilde)', 'GET', '/productos', {
        consulta: { q: 'cafe' },
        pruebas: [
          estado(200),
          "pm.test('encuentra el café', () => pm.expect(pm.response.json()[0].nombre).to.include('Café'));"
        ]
      }),
      peticion('GET /productos?orden=precio_asc', 'GET', '/productos', {
        consulta: { orden: 'precio_asc' },
        pruebas: [
          estado(200),
          "pm.test('ordenado por precio', () => { const p = pm.response.json().map(x => x.precio); pm.expect(p).to.eql([...p].sort((a, b) => a - b)); });"
        ]
      }),
      peticion('GET /productos?limite=0 (inválido)', 'GET', '/productos', {
        consulta: { limite: '0' },
        pruebas: [estado(400, 'Parámetro inválido: 400')]
      }),
      peticion('GET /productos/p1', 'GET', '/productos/p1', {
        pruebas: [
          estado(200),
          "pm.test('es la vela', () => pm.expect(pm.response.json().nombre).to.include('Vela'));"
        ]
      }),
      peticion('GET /productos/p999 (no existe)', 'GET', '/productos/p999', {
        pruebas: [estado(404, 'No existe: 404')]
      }),
      peticion('POST /productos (sin sesión)', 'POST', '/productos', {
        cuerpo: producto,
        pruebas: [estado(401, 'Sin sesión: 401')]
      }),
      peticion('POST /productos (datos inválidos)', 'POST', '/productos', {
        token: 'tokenCamila',
        cuerpo: { ...producto, precio: 100 },
        pruebas: [
          estado(400, 'Datos inválidos: 400'),
          "pm.test('señala el campo precio', () => pm.expect(pm.response.json().error.detalles[0].campo).to.eql('precio'));"
        ]
      }),
      peticion('POST /productos (crear)', 'POST', '/productos', {
        token: 'tokenCamila',
        cuerpo: producto,
        pruebas: [
          estado(201, 'Crea el producto (201)'),
          "pm.test('trae Location', () => pm.expect(pm.response.headers.get('Location')).to.include('/api/productos/'));",
          guardar('productoId', 'pm.response.json().id')
        ]
      }),
      peticion('PUT /productos/:id (el dueño)', 'PUT', '/productos/{{productoId}}', {
        token: 'tokenCamila',
        cuerpo: { ...producto, precio: 13500, stock: 10 },
        pruebas: [
          estado(200),
          "pm.test('precio actualizado', () => pm.expect(pm.response.json().precio).to.eql(13500));"
        ]
      }),
      peticion('PUT /productos/:id (otra persona)', 'PUT', '/productos/{{productoId}}', {
        token: 'tokenAndres',
        cuerpo: producto,
        pruebas: [estado(403, 'No es el dueño: 403')]
      }),
      peticion('DELETE /productos/:id (otra persona)', 'DELETE', '/productos/{{productoId}}', {
        token: 'tokenAndres',
        pruebas: [estado(403, 'No es el dueño: 403')]
      }),
      peticion('DELETE /productos/:id (el dueño)', 'DELETE', '/productos/{{productoId}}', {
        token: 'tokenCamila',
        pruebas: [estado(204, 'Elimina el producto (204)')]
      }),
      peticion('GET /productos/:id (ya eliminado)', 'GET', '/productos/{{productoId}}', {
        pruebas: [estado(404, 'Ya no existe: 404')]
      })
    ]
  },
  {
    name: '4. Cursos e inscripciones',
    item: [
      peticion('GET /cursos', 'GET', '/cursos', {
        pruebas: [
          estado(200),
          "pm.test('al menos 8 cursos', () => pm.expect(pm.response.json().length).to.be.at.least(8));"
        ]
      }),
      peticion('GET /cursos?nivel=Principiante', 'GET', '/cursos', {
        consulta: { nivel: 'Principiante' },
        pruebas: [
          estado(200),
          "pm.test('todos son Principiante', () => pm.expect(pm.response.json().every(c => c.nivel === 'Principiante')).to.be.true);"
        ]
      }),
      peticion('GET /cursos/c1', 'GET', '/cursos/c1', {
        pruebas: [
          estado(200),
          "pm.test('trae temario', () => pm.expect(pm.response.json().temario).to.be.an('array'));"
        ]
      }),
      peticion('POST /cursos (crear)', 'POST', '/cursos', {
        token: 'tokenAndres',
        cuerpo: curso,
        pruebas: [estado(201, 'Crea el curso (201)'), guardar('cursoId', 'pm.response.json().id')]
      }),
      peticion('POST /cursos (datos inválidos)', 'POST', '/cursos', {
        token: 'tokenAndres',
        cuerpo: { ...curso, nivel: 'Experto' },
        pruebas: [estado(400, 'Datos inválidos: 400')]
      }),
      peticion('PUT /cursos/:id', 'PUT', '/cursos/{{cursoId}}', {
        token: 'tokenAndres',
        cuerpo: { ...curso, cupos: 12 },
        pruebas: [
          estado(200),
          "pm.test('cupos actualizados', () => pm.expect(pm.response.json().cupos).to.eql(12));"
        ]
      }),
      peticion('POST /cursos/:id/inscripcion', 'POST', '/cursos/{{cursoId}}/inscripcion', {
        token: 'tokenCamila',
        cuerpo: { pago: 'Nequi' },
        pruebas: [
          estado(201, 'Se inscribe (201)'),
          "pm.test('guarda la comisión del 10 %', () => { const j = pm.response.json(); pm.expect(j.comision).to.eql(Math.round(j.precio * 0.1)); });"
        ]
      }),
      peticion('GET /cursos/:id (un cupo menos)', 'GET', '/cursos/{{cursoId}}', {
        pruebas: [
          estado(200),
          "pm.test('quedan 11 cupos', () => pm.expect(pm.response.json().cupos).to.eql(11));"
        ]
      }),
      peticion('POST /cursos/:id/inscripcion (repetida)', 'POST', '/cursos/{{cursoId}}/inscripcion', {
        token: 'tokenCamila',
        cuerpo: {},
        pruebas: [estado(409, 'Ya inscrita: 409')]
      }),
      peticion('GET /inscripciones', 'GET', '/inscripciones', {
        token: 'tokenCamila',
        pruebas: [
          estado(200),
          "pm.test('trae el curso', () => pm.expect(pm.response.json()[0].curso.id).to.eql(pm.collectionVariables.get('cursoId')));"
        ]
      }),
      peticion('DELETE /cursos/:id/inscripcion', 'DELETE', '/cursos/{{cursoId}}/inscripcion', {
        token: 'tokenCamila',
        pruebas: [estado(204, 'Cancela la inscripción (204)')]
      }),
      peticion('DELETE /cursos/:id', 'DELETE', '/cursos/{{cursoId}}', {
        token: 'tokenAndres',
        pruebas: [estado(204, 'Elimina el curso (204)')]
      })
    ]
  },
  {
    name: '5. Pedidos',
    item: [
      peticion('POST /pedidos (sin sesión)', 'POST', '/pedidos', {
        cuerpo: { items: [{ productoId: 'p2', cantidad: 1 }], cliente, pago: 'Nequi' },
        pruebas: [estado(401, 'Sin sesión: 401')]
      }),
      peticion('POST /pedidos (más que el stock)', 'POST', '/pedidos', {
        token: 'tokenCamila',
        cuerpo: { items: [{ productoId: 'p2', cantidad: 99 }], cliente, pago: 'Nequi' },
        pruebas: [
          estado(409, 'Sin stock suficiente: 409'),
          "pm.test('dice cuántas quedan', () => pm.expect(pm.response.json().error.mensaje).to.include('Solo quedan'));"
        ]
      }),
      peticion('POST /pedidos (comprar lo propio)', 'POST', '/pedidos', {
        token: 'tokenAndres',
        cuerpo: { items: [{ productoId: 'p2', cantidad: 1 }], cliente, pago: 'Nequi' },
        pruebas: [estado(409, 'No puede comprar lo propio: 409')]
      }),
      peticion('POST /pedidos (dos vendedores)', 'POST', '/pedidos', {
        token: 'tokenCamila',
        cuerpo: {
          items: [
            { productoId: 'p2', cantidad: 1 },
            { productoId: 'p3', cantidad: 2 }
          ],
          cliente,
          pago: 'Nequi'
        },
        pruebas: [
          estado(201, 'Crea los pedidos (201)'),
          "pm.test('crea un pedido por vendedor', () => pm.expect(pm.response.json().length).to.eql(2));",
          "pm.test('calcula la comisión del 10 %', () => pm.response.json().forEach(p => pm.expect(p.comision).to.eql(Math.round(p.total * 0.1))));",
          guardar('pedidoId', "pm.response.json().find(p => p.vendedorId === 'u_andres').id")
        ]
      }),
      peticion('GET /pedidos (los de Andrés)', 'GET', '/pedidos', {
        token: 'tokenAndres',
        pruebas: [
          estado(200),
          "pm.test('incluye el pedido nuevo', () => pm.expect(pm.response.json().some(p => p.id === pm.collectionVariables.get('pedidoId'))).to.be.true);"
        ]
      }),
      peticion('GET /pedidos/:id', 'GET', '/pedidos/{{pedidoId}}', {
        token: 'tokenCamila',
        pruebas: [
          estado(200),
          "pm.test('estado Nuevo', () => pm.expect(pm.response.json().estado).to.eql('Nuevo'));"
        ]
      }),
      peticion('GET /pedidos/:id (de otra persona)', 'GET', '/pedidos/{{pedidoId}}', {
        token: 'tokenAdmin',
        pruebas: [estado(200, 'El administrador sí lo ve: 200')]
      }),
      peticion('PUT /pedidos/:id/estado (salto no permitido)', 'PUT', '/pedidos/{{pedidoId}}/estado', {
        token: 'tokenAndres',
        cuerpo: { estado: 'Entregado' },
        pruebas: [estado(409, 'No se salta de Nuevo a Entregado: 409')]
      }),
      peticion('PUT /pedidos/:id/estado (comprador no avanza)', 'PUT', '/pedidos/{{pedidoId}}/estado', {
        token: 'tokenCamila',
        cuerpo: { estado: 'Preparando' },
        pruebas: [estado(403, 'El comprador no puede avanzar: 403')]
      }),
      peticion('PUT /pedidos/:id/estado (a Preparando)', 'PUT', '/pedidos/{{pedidoId}}/estado', {
        token: 'tokenAndres',
        cuerpo: { estado: 'Preparando' },
        pruebas: [
          estado(200),
          "pm.test('queda en Preparando', () => pm.expect(pm.response.json().estado).to.eql('Preparando'));"
        ]
      }),
      peticion('PUT /pedidos/:id/estado (cancelar y devolver stock)', 'PUT', '/pedidos/{{pedidoId}}/estado', {
        token: 'tokenAndres',
        cuerpo: { estado: 'Cancelado' },
        pruebas: [
          estado(200),
          "pm.test('queda Cancelado', () => pm.expect(pm.response.json().estado).to.eql('Cancelado'));"
        ]
      }),
      peticion('PUT /pedidos/:id/estado (ya cancelado)', 'PUT', '/pedidos/{{pedidoId}}/estado', {
        token: 'tokenAndres',
        cuerpo: { estado: 'Preparando' },
        pruebas: [estado(409, 'Un pedido cancelado no cambia: 409')]
      })
    ]
  },
  {
    name: '6. Administración',
    item: [
      peticion('GET /vendedores', 'GET', '/vendedores', {
        pruebas: [
          estado(200),
          "pm.test('sin correo ni WhatsApp', () => pm.expect(pm.response.json().every(v => v.email === undefined && v.whatsapp === undefined)).to.be.true);"
        ]
      }),
      peticion('GET /config', 'GET', '/config', {
        pruebas: [
          estado(200),
          "pm.test('comisión del 10 %', () => pm.expect(pm.response.json().comisionPorcentaje).to.eql(10));"
        ]
      }),
      peticion('PUT /config (estudiante)', 'PUT', '/config', {
        token: 'tokenCamila',
        cuerpo: { comisionPorcentaje: 5 },
        pruebas: [estado(403, 'Un estudiante no puede: 403')]
      }),
      peticion('PUT /config (valor inválido)', 'PUT', '/config', {
        token: 'tokenAdmin',
        cuerpo: { comisionPorcentaje: 25 },
        pruebas: [estado(400, 'Fuera de 0 a 20: 400')]
      }),
      peticion('PUT /config (administrador)', 'PUT', '/config', {
        token: 'tokenAdmin',
        cuerpo: { comisionPorcentaje: 8 },
        pruebas: [
          estado(200),
          "pm.test('queda en 8', () => pm.expect(pm.response.json().comisionPorcentaje).to.eql(8));"
        ]
      }),
      peticion('PUT /config (volver al 10 %)', 'PUT', '/config', {
        token: 'tokenAdmin',
        cuerpo: { comisionPorcentaje: 10 },
        pruebas: [estado(200)]
      }),
      peticion('GET /usuarios (administrador)', 'GET', '/usuarios', {
        token: 'tokenAdmin',
        pruebas: [
          estado(200),
          "pm.test('no muestra hashes', () => pm.expect(JSON.stringify(pm.response.json())).to.not.include('pass'));"
        ]
      }),
      peticion('GET /usuarios (estudiante)', 'GET', '/usuarios', {
        token: 'tokenCamila',
        pruebas: [estado(403, 'Un estudiante no puede: 403')]
      }),
      peticion('DELETE /usuarios/:id (cuenta de prueba)', 'DELETE', '/usuarios/{{usuarioNuevoId}}', {
        token: 'tokenAdmin',
        pruebas: [estado(204, 'Elimina la cuenta (204)')]
      }),
      peticion('DELETE /usuarios/u_admin (otro administrador)', 'DELETE', '/usuarios/u_admin', {
        token: 'tokenAdmin',
        pruebas: [estado(409, 'No se elimina a un administrador: 409')]
      })
    ]
  }
];

const coleccion = {
  info: {
    name: 'Plaza U · API REST',
    description:
      'Colección de pruebas de la API de Plaza U. Ejecútala en orden: las primeras peticiones guardan los tokens y los ids que usan las siguientes.',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
  },
  item: carpetas,
  variable: [
    'tokenCamila',
    'tokenAndres',
    'tokenAdmin',
    'productoId',
    'cursoId',
    'pedidoId',
    'usuarioNuevoId',
    'emailNuevo'
  ].map(key => ({ key, value: '' }))
};
const entorno = {
  name: 'Plaza U · local',
  values: [{ key: 'baseUrl', value: 'http://localhost:3000/api', enabled: true }],
  _postman_variable_scope: 'environment'
};

mkdirSync(new URL('../../docs/postman/', import.meta.url), { recursive: true });
writeFileSync(
  new URL('../../docs/postman/Plaza-U.postman_collection.json', import.meta.url),
  JSON.stringify(coleccion, null, 2)
);
writeFileSync(
  new URL('../../docs/postman/Plaza-U.local.postman_environment.json', import.meta.url),
  JSON.stringify(entorno, null, 2)
);
const total = carpetas.reduce((n, c) => n + c.item.length, 0);
console.log(`Colección generada: ${carpetas.length} carpetas y ${total} peticiones`);
