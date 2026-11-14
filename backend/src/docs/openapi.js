import { endpoints } from './endpoints.js';

// Construye la especificación OpenAPI 3 a partir de la lista de endpoints.
const parametrosDeRuta = ruta =>
  [...ruta.matchAll(/\{(\w+)\}/g)].map(([, nombre]) => ({
    name: nombre,
    in: 'path',
    required: true,
    schema: { type: 'string' }
  }));

function operacion(e) {
  const op = {
    tags: [e.grupo],
    summary: e.resumen,
    parameters: [
      ...parametrosDeRuta(e.ruta),
      ...(e.query ?? []).map(([nombre, descripcion]) => ({
        name: nombre,
        in: 'query',
        description: descripcion,
        schema: { type: 'string' }
      }))
    ],
    responses: Object.fromEntries(
      e.respuestas.map(([codigo, descripcion]) => [
        String(codigo),
        codigo >= 400
          ? {
              description: descripcion,
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            }
          : { description: descripcion }
      ])
    )
  };
  if (e.cuerpo) {
    op.requestBody = {
      required: true,
      content: {
        'application/json': { schema: { type: 'object' }, example: e.cuerpo }
      }
    };
  }
  if (e.auth !== 'publica') op.security = [{ bearerAuth: [] }];
  if (e.auth === 'admin') op.summary += ' (solo administrador)';
  return op;
}

const paths = {};
for (const e of endpoints) {
  paths[e.ruta] ??= {};
  paths[e.ruta][e.metodo.toLowerCase()] = operacion(e);
}

export const openapi = {
  openapi: '3.0.3',
  info: {
    title: 'Plaza U · API REST',
    version: '1.0.0',
    description:
      'API del mercadito y la escuela de los estudiantes. Para probar las rutas protegidas: inicia sesión en POST /auth/login, ' +
      'copia el token, pulsa el botón Authorize y pégalo. Cuenta de prueba: camila@plazau.co / demo1234 (administrador: admin@plazau.co / admin123).'
  },
  servers: [{ url: '/api', description: 'Este servidor' }],
  tags: [...new Set(endpoints.map(e => e.grupo))].map(name => ({ name })),
  paths,
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'object',
            properties: {
              estado: { type: 'integer', example: 400 },
              mensaje: {
                type: 'string',
                example: 'Hay datos inválidos en la petición'
              },
              detalles: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    campo: { type: 'string' },
                    mensaje: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
