# Plaza U · API REST

Base: `http://localhost:3000/api` · Documentación interactiva: `http://localhost:3000/api-docs`

## Cómo usarla

1. Inicia sesión con `POST /auth/login` y copia el `token` de la respuesta.
2. En las rutas con sesión envía el encabezado `Authorization: Bearer <token>`.
3. Todas las respuestas son JSON. Los errores siempre tienen la misma forma:

```json
{ "error": { "estado": 400, "mensaje": "Hay datos inválidos en la petición", "detalles": [ { "campo": "precio", "mensaje": "El precio debe ser un entero entre 500 y 10.000.000" } ] } }
```

Cuentas de prueba: `camila@plazau.co` / `demo1234` (estudiante) y `admin@plazau.co` / `admin123` (administrador).

## Resumen de endpoints

| Método | Ruta | Acceso | Qué hace |
| --- | --- | --- | --- |
| GET | `/health` | Pública | Comprueba que la API está viva y con qué base de datos trabaja. |
| POST | `/auth/registro` | Pública | Crea una cuenta de estudiante y devuelve el token. |
| POST | `/auth/login` | Pública | Inicia sesión y devuelve el token JWT (dura 8 horas). |
| GET | `/auth/yo` | Con sesión | Devuelve los datos de la persona dueña del token. |
| GET | `/productos` | Pública | Lista los productos. Admite búsqueda, filtro por categoría, orden y paginación. El total viaja en el encabezado X-Total-Count. |
| GET | `/productos/{id}` | Pública | Devuelve un producto por su id. |
| POST | `/productos` | Con sesión | Publica un producto. El dueño es quien tiene la sesión. |
| PUT | `/productos/{id}` | Con sesión | Reemplaza los datos de un producto. Solo su dueño o un administrador. |
| DELETE | `/productos/{id}` | Con sesión | Elimina un producto. Solo su dueño o un administrador. |
| GET | `/cursos` | Pública | Lista los cursos presenciales. Admite búsqueda, filtro por nivel y categoría, orden y paginación. |
| GET | `/cursos/{id}` | Pública | Devuelve un curso por su id. |
| POST | `/cursos` | Con sesión | Publica un curso. Quien lo crea queda como instructor. |
| PUT | `/cursos/{id}` | Con sesión | Reemplaza los datos de un curso. Solo su instructor o un administrador. |
| DELETE | `/cursos/{id}` | Con sesión | Elimina un curso. Solo su instructor o un administrador. |
| POST | `/cursos/{id}/inscripcion` | Con sesión | Inscribe a la persona en el curso y descuenta un cupo. |
| DELETE | `/cursos/{id}/inscripcion` | Con sesión | Cancela la inscripción y devuelve el cupo. |
| GET | `/inscripciones` | Con sesión | Lista las inscripciones de la persona, con los datos de cada curso. |
| POST | `/pedidos` | Con sesión | Crea los pedidos de un carrito (uno por vendedor) y descuenta el stock, todo en una transacción. |
| GET | `/pedidos` | Con sesión | Lista los pedidos donde la persona compra o vende. El administrador ve todos. |
| GET | `/pedidos/{id}` | Con sesión | Devuelve un pedido. Solo su comprador, su vendedor o un administrador. |
| PUT | `/pedidos/{id}/estado` | Con sesión | Cambia el estado. Se avanza de a un paso (Nuevo, Preparando, En camino, Entregado) o se cancela, y al cancelar se devuelve el stock. |
| GET | `/vendedores` | Pública | Lista pública de los estudiantes que venden o dictan cursos (sin correo ni WhatsApp). |
| GET | `/config` | Pública | Devuelve el porcentaje de comisión vigente. |
| PUT | `/config` | Solo administrador | Cambia el porcentaje de comisión (0 a 20). |
| GET | `/usuarios` | Solo administrador | Lista todas las cuentas. |
| DELETE | `/usuarios/{id}` | Solo administrador | Elimina una cuenta de estudiante con sus productos, cursos e inscripciones. |

## Salud

### GET `/health`

Comprueba que la API está viva y con qué base de datos trabaja.

**Acceso:** Pública

**Respuestas:**

- `200`: La API responde

## Autenticación

### POST `/auth/registro`

Crea una cuenta de estudiante y devuelve el token.

**Acceso:** Pública

**Cuerpo de ejemplo:**

```json
{
  "nombre": "Ana Torres",
  "email": "ana@correo.com",
  "password": "clave12345",
  "carrera": "Diseño gráfico"
}
```

**Respuestas:**

- `201`: Cuenta creada: devuelve { token, usuario }
- `400`: Datos inválidos
- `409`: Ya existe una cuenta con ese correo

### POST `/auth/login`

Inicia sesión y devuelve el token JWT (dura 8 horas).

**Acceso:** Pública

**Cuerpo de ejemplo:**

```json
{
  "email": "camila@plazau.co",
  "password": "demo1234"
}
```

**Respuestas:**

- `200`: Sesión iniciada: devuelve { token, usuario }
- `400`: Datos inválidos
- `401`: Correo o contraseña incorrectos

### GET `/auth/yo`

Devuelve los datos de la persona dueña del token.

**Acceso:** Con sesión

**Respuestas:**

- `200`: Datos del usuario
- `401`: Sin token o token inválido

## Productos

### GET `/productos`

Lista los productos. Admite búsqueda, filtro por categoría, orden y paginación. El total viaja en el encabezado X-Total-Count.

**Acceso:** Pública

**Parámetros de consulta:**

- `q`: Texto a buscar (ignora tildes y mayúsculas)
- `categoria`: Una de las categorías de productos
- `orden`: recientes, precio_asc o precio_desc
- `limite`: Cuántos devolver (1 a 100, por defecto 50)
- `desde`: Cuántos saltar (paginación)

**Respuestas:**

- `200`: Lista de productos
- `400`: Parámetros inválidos

### GET `/productos/{id}`

Devuelve un producto por su id.

**Acceso:** Pública

**Respuestas:**

- `200`: El producto
- `404`: No existe

### POST `/productos`

Publica un producto. El dueño es quien tiene la sesión.

**Acceso:** Con sesión

**Cuerpo de ejemplo:**

```json
{
  "nombre": "Galletas de avena y miel",
  "categoria": "Comida",
  "precio": 12000,
  "stock": 25,
  "descripcion": "Galletas caseras de avena con miel, bolsa de 8 unidades."
}
```

**Respuestas:**

- `201`: Producto creado (encabezado Location con su dirección)
- `400`: Datos inválidos
- `401`: Sin sesión

### PUT `/productos/{id}`

Reemplaza los datos de un producto. Solo su dueño o un administrador.

**Acceso:** Con sesión

**Cuerpo de ejemplo:**

```json
{
  "nombre": "Galletas de avena y miel",
  "categoria": "Comida",
  "precio": 13000,
  "stock": 20,
  "descripcion": "Galletas caseras de avena con miel, bolsa de 8 unidades."
}
```

**Respuestas:**

- `200`: Producto actualizado
- `400`: Datos inválidos
- `401`: Sin sesión
- `403`: No eres el dueño
- `404`: No existe

### DELETE `/productos/{id}`

Elimina un producto. Solo su dueño o un administrador.

**Acceso:** Con sesión

**Respuestas:**

- `204`: Eliminado (sin contenido)
- `401`: Sin sesión
- `403`: No eres el dueño
- `404`: No existe

## Cursos

### GET `/cursos`

Lista los cursos presenciales. Admite búsqueda, filtro por nivel y categoría, orden y paginación.

**Acceso:** Pública

**Parámetros de consulta:**

- `q`: Texto a buscar
- `nivel`: Principiante, Intermedio o Avanzado
- `categoria`: Una de las categorías de cursos
- `orden`: recientes, precio_asc o precio_desc
- `limite`: Cuántos devolver
- `desde`: Cuántos saltar

**Respuestas:**

- `200`: Lista de cursos
- `400`: Parámetros inválidos

### GET `/cursos/{id}`

Devuelve un curso por su id.

**Acceso:** Pública

**Respuestas:**

- `200`: El curso
- `404`: No existe

### POST `/cursos`

Publica un curso. Quien lo crea queda como instructor.

**Acceso:** Con sesión

**Cuerpo de ejemplo:**

```json
{
  "titulo": "Fotografía con el celular",
  "categoria": "Diseño",
  "nivel": "Principiante",
  "precio": 35000,
  "cupos": 15,
  "horario": "Sábados, 10:00 a. m. · Bloque 3",
  "duracion": "3 sesiones de 2 horas",
  "descripcion": "Aprende encuadre, luz y edición básica para tus fotos de producto.",
  "temario": [
    "Encuadre y luz",
    "Edición básica",
    "Fotos de producto"
  ]
}
```

**Respuestas:**

- `201`: Curso creado
- `400`: Datos inválidos
- `401`: Sin sesión

### PUT `/cursos/{id}`

Reemplaza los datos de un curso. Solo su instructor o un administrador.

**Acceso:** Con sesión

**Cuerpo de ejemplo:**

```json
{
  "titulo": "Fotografía con el celular",
  "categoria": "Diseño",
  "nivel": "Principiante",
  "precio": 35000,
  "cupos": 12,
  "horario": "Sábados, 10:00 a. m. · Bloque 3",
  "duracion": "3 sesiones de 2 horas",
  "descripcion": "Aprende encuadre, luz y edición básica para tus fotos de producto.",
  "temario": [
    "Encuadre y luz",
    "Edición básica",
    "Fotos de producto"
  ]
}
```

**Respuestas:**

- `200`: Curso actualizado
- `400`: Datos inválidos
- `401`: Sin sesión
- `403`: No eres el instructor
- `404`: No existe

### DELETE `/cursos/{id}`

Elimina un curso. Solo su instructor o un administrador.

**Acceso:** Con sesión

**Respuestas:**

- `204`: Eliminado
- `401`: Sin sesión
- `403`: No eres el instructor
- `404`: No existe

## Inscripciones

### POST `/cursos/{id}/inscripcion`

Inscribe a la persona en el curso y descuenta un cupo.

**Acceso:** Con sesión

**Cuerpo de ejemplo:**

```json
{
  "pago": "Nequi"
}
```

**Respuestas:**

- `201`: Inscripción creada
- `401`: Sin sesión
- `404`: El curso no existe
- `409`: Ya inscrito, sin cupos o es tu propio curso

### DELETE `/cursos/{id}/inscripcion`

Cancela la inscripción y devuelve el cupo.

**Acceso:** Con sesión

**Respuestas:**

- `204`: Cancelada
- `401`: Sin sesión
- `404`: No estabas inscrito

### GET `/inscripciones`

Lista las inscripciones de la persona, con los datos de cada curso.

**Acceso:** Con sesión

**Respuestas:**

- `200`: Lista de inscripciones
- `401`: Sin sesión

## Pedidos

### POST `/pedidos`

Crea los pedidos de un carrito (uno por vendedor) y descuenta el stock, todo en una transacción.

**Acceso:** Con sesión

**Cuerpo de ejemplo:**

```json
{
  "items": [
    {
      "productoId": "p1",
      "cantidad": 2
    },
    {
      "productoId": "p3",
      "cantidad": 1
    }
  ],
  "cliente": {
    "nombre": "Ana Torres",
    "celular": "3001234567",
    "direccion": "Bloque 5, salón 302",
    "notas": "Salgo a las 2 p. m."
  },
  "pago": "Nequi"
}
```

**Respuestas:**

- `201`: Lista de pedidos creados
- `400`: Datos inválidos
- `401`: Sin sesión
- `404`: Un producto no existe
- `409`: Sin stock suficiente o producto propio

### GET `/pedidos`

Lista los pedidos donde la persona compra o vende. El administrador ve todos.

**Acceso:** Con sesión

**Respuestas:**

- `200`: Lista de pedidos
- `401`: Sin sesión

### GET `/pedidos/{id}`

Devuelve un pedido. Solo su comprador, su vendedor o un administrador.

**Acceso:** Con sesión

**Respuestas:**

- `200`: El pedido
- `401`: Sin sesión
- `403`: No es tu pedido
- `404`: No existe

### PUT `/pedidos/{id}/estado`

Cambia el estado. Se avanza de a un paso (Nuevo, Preparando, En camino, Entregado) o se cancela, y al cancelar se devuelve el stock.

**Acceso:** Con sesión

**Cuerpo de ejemplo:**

```json
{
  "estado": "Preparando"
}
```

**Respuestas:**

- `200`: Pedido actualizado
- `400`: Estado inválido
- `403`: Sin permiso para ese cambio
- `404`: No existe
- `409`: Salto de estado no permitido o pedido cerrado

## Administración

### GET `/vendedores`

Lista pública de los estudiantes que venden o dictan cursos (sin correo ni WhatsApp).

**Acceso:** Pública

**Respuestas:**

- `200`: Lista de vendedores

### GET `/config`

Devuelve el porcentaje de comisión vigente.

**Acceso:** Pública

**Respuestas:**

- `200`: Configuración

### PUT `/config`

Cambia el porcentaje de comisión (0 a 20).

**Acceso:** Solo administrador

**Cuerpo de ejemplo:**

```json
{
  "comisionPorcentaje": 8
}
```

**Respuestas:**

- `200`: Configuración actualizada
- `400`: Valor inválido
- `401`: Sin sesión
- `403`: No eres administrador

### GET `/usuarios`

Lista todas las cuentas.

**Acceso:** Solo administrador

**Respuestas:**

- `200`: Lista de usuarios
- `401`: Sin sesión
- `403`: No eres administrador

### DELETE `/usuarios/{id}`

Elimina una cuenta de estudiante con sus productos, cursos e inscripciones.

**Acceso:** Solo administrador

**Respuestas:**

- `204`: Eliminada
- `401`: Sin sesión
- `403`: No eres administrador
- `404`: No existe
- `409`: No se puede eliminar a un administrador
