# Plaza U · Backend (API REST con Express)

API del mercadito y la escuela de los estudiantes. Hecha con **Node.js y Express**, con **PostgreSQL** como base de datos.

## Arquitectura por capas

```
src/
  server.js          arranca: conecta la base de datos, siembra datos de ejemplo y abre el puerto
  app.js             arma Express: seguridad, JSON, rutas, documentación y errores
  config/            variables de entorno, constantes y conexión a la base de datos
  routes/            qué URL existe y qué middlewares pasa cada una
  validators/        reglas de validación de lo que llega (express-validator)
  middlewares/       autenticación (JWT), roles, validación y manejo de errores
  controllers/       leen la petición HTTP y arman la respuesta
  services/          las reglas del negocio: permisos, stock, cupos, estados, comisión
  models/            el único lugar donde se escribe SQL
  db/                esquema, datos de ejemplo y sembrado
  docs/              lista de endpoints, Swagger y generador de la documentación
  utils/             AppError, asyncHandler, mapeos, ids
tests/               pruebas automáticas (node:test + supertest)
postman/             generador de la colección de Postman
```

Una petición recorre este camino: **ruta → validadores → validar → (autenticar) → controlador → servicio → modelo → base de datos**, y la respuesta vuelve por el mismo camino. Si algo falla, el error llega al middleware `manejarErrores`, que responde siempre con el mismo formato.

## Cómo ejecutarlo

```bash
npm install
npm run dev        # con recarga automática
npm start          # sin recarga
```

- API: <http://localhost:3000/api>
- Documentación interactiva: <http://localhost:3000/api-docs>

Todo funciona sin configurar nada. Para cambiar valores copia `.env.example` como `.env`.

## Base de datos

El código usa siempre PostgreSQL. Según la configuración trabaja con uno de dos motores:

| Motor | Cuándo | Datos |
| --- | --- | --- |
| **PGlite** (PostgreSQL embebido) | Sin `DATABASE_URL` | Se guardan en `.data/` y se reinician con `npm run db:reset` |
| **PostgreSQL** (por ejemplo Supabase) | Con `DATABASE_URL` en `.env` | Quedan en el esquema `plaza_express`, separado de otras tablas |

Para usar Supabase: en el panel ve a **Project Settings → Database → Connection string**, elige el **Session pooler** (puerto 5432) y pégalo en `.env` como `DATABASE_URL`. La contraseña de la base nunca se sube a GitHub (`.env` está en `.gitignore`).

## Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor con recarga automática |
| `npm start` | Servidor |
| `npm test` | 77 pruebas automáticas de los endpoints |
| `npm run db:reset` | Reinicia la base local con los datos de ejemplo |
| `npm run docs` | Regenera `docs/API.md` |
| `npm run postman` | Regenera la colección de Postman |
| `npm run lint` / `npm run format` | Revisión y formato del código |

## Seguridad

- Contraseñas con **bcrypt** (hash con sal). Sesión con **JWT** de 8 horas.
- El token se revisa en cada petición y el usuario se vuelve a leer de la base: si borran la cuenta, el token deja de servir.
- Todo lo que llega se valida; las consultas SQL usan parámetros (`$1`, `$2`…) y nunca texto concatenado.
- `helmet` pone encabezados de seguridad y `cors` permite al frontend llamar a la API.

## Reglas del negocio

- **Stock:** al crear un pedido se bloquean las filas de los productos, se revisa el inventario y se descuenta, todo en una transacción. Dos compras simultáneas del último producto: solo una gana.
- **Pedidos:** uno por vendedor; estados Nuevo → Preparando → En camino → Entregado, o Cancelado (que devuelve el stock).
- **Cupos:** una inscripción por persona y curso; si se acaban los cupos, responde 409.
- **Comisión:** 10 % por defecto, configurable por el administrador entre 0 y 20 %; queda guardada en cada pedido e inscripción.
