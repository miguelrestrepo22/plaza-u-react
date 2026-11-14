# Plaza U

Plaza U es el mercadito y la escuela de los estudiantes: un sitio donde se **comercializan productos hechos por estudiantes** y se **ofrecen cursos presenciales** dentro de la universidad. Las entregas y las clases son solo dentro del campus.

**Integrantes:** Miguel Angel Restrepo Pineda y Lucas Lobo Lopez · Tecnológico de Antioquia · Construcción de Software III

Este repositorio reúne el **frontend** (React) y el **backend** (API REST con Node.js y Express):

| Carpeta | Qué es | Entregable |
| --- | --- | --- |
| [`frontend/`](frontend) | Interfaz en React + Vite. Lee el catálogo de la API; si la API está apagada, usa datos de ejemplo | Primero y segundo |
| [`backend/`](backend) | API REST con Express: rutas, controladores, servicios, modelos, middlewares y PostgreSQL | Segundo |
| [`docs/`](docs) | Documentos de los entregables, documentación de la API, colección de Postman y evidencias | Primero y segundo |

## Cómo ejecutarlo

Necesitas [Node.js](https://nodejs.org) 20 o superior. Abre **dos terminales**.

**1. Backend** (puerto 3000):

```bash
cd backend
npm install
npm run dev
```

La primera vez crea la base de datos local con datos de ejemplo. Abre <http://localhost:3000/api-docs> para ver la documentación interactiva de la API (Swagger).

**2. Frontend** (puerto 5173):

```bash
cd frontend
npm install
npm run dev
```

Abre <http://localhost:5173>. El pie de página dice «Datos desde la API» cuando el backend está encendido.

Cuentas de prueba: `camila@plazau.co` / `demo1234` (estudiante) y `admin@plazau.co` / `admin123` (administrador).

## Pruebas

```bash
cd backend
npm test            # 77 pruebas automáticas de la API
```

Colección de Postman: [`docs/postman`](docs/postman). Con la API encendida se puede ejecutar desde la consola:

```bash
npx newman run docs/postman/Plaza-U.postman_collection.json --environment docs/postman/Plaza-U.local.postman_environment.json
```

## Dónde está cada requisito del segundo entregable

| Requisito | Dónde está |
| --- | --- |
| Backend con Node.js y Express | `backend/src/app.js`, `backend/src/server.js` |
| Estructura `routes`, `controllers`, `services`, `models` | `backend/src/routes`, `controllers`, `services`, `models` |
| Endpoints GET, POST, PUT y DELETE | 26 endpoints, ver [`docs/API.md`](docs/API.md) |
| Middlewares de validación y manejo de errores | `backend/src/middlewares`, `backend/src/validators` |
| Pruebas de endpoints | `docs/postman` (Postman/Newman) y `backend/tests` (automáticas) |
| Conexión con base de datos | `backend/src/config/db.js`, `backend/src/db/schema.sql` (PostgreSQL) |
| Documentación de la API | `docs/API.md` y Swagger en `/api-docs` |
| Evidencia de funcionamiento | `docs/evidencias` y el documento `docs/Segundo-entregable-PlazaU.docx` |

## Estructura del repositorio

```
plaza-u/
  backend/        API REST (Express)
  frontend/       interfaz (React + Vite)
  docs/
    API.md                  documentación de los endpoints
    postman/                colección, entorno y resultado de Newman
    evidencias/             capturas y ejemplos
    entregable-1/           documento y capturas del primer entregable
    Segundo-entregable-PlazaU.docx / .pdf
```
