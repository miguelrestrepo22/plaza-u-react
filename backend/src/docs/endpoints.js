// Fuente única de la documentación: de esta lista salen Swagger (/api-docs) y el archivo docs/API.md.
// auth: 'publica' (sin sesión), 'sesion' (token de cualquier usuario) o 'admin' (solo administrador).

const productoEjemplo = {
  nombre: 'Galletas de avena y miel',
  categoria: 'Comida',
  precio: 12000,
  stock: 25,
  descripcion: 'Galletas caseras de avena con miel, bolsa de 8 unidades.'
};
const cursoEjemplo = {
  titulo: 'Fotografía con el celular',
  categoria: 'Diseño',
  nivel: 'Principiante',
  precio: 35000,
  cupos: 15,
  horario: 'Sábados, 10:00 a. m. · Bloque 3',
  duracion: '3 sesiones de 2 horas',
  descripcion: 'Aprende encuadre, luz y edición básica para tus fotos de producto.',
  temario: ['Encuadre y luz', 'Edición básica', 'Fotos de producto']
};

export const grupos = [
  'Salud',
  'Autenticación',
  'Productos',
  'Cursos',
  'Inscripciones',
  'Pedidos',
  'Administración'
];

export const endpoints = [
  {
    grupo: 'Salud',
    metodo: 'GET',
    ruta: '/health',
    auth: 'publica',
    resumen: 'Comprueba que la API está viva y con qué base de datos trabaja.',
    respuestas: [[200, 'La API responde']]
  },

  {
    grupo: 'Autenticación',
    metodo: 'POST',
    ruta: '/auth/registro',
    auth: 'publica',
    resumen: 'Crea una cuenta de estudiante y devuelve el token.',
    cuerpo: {
      nombre: 'Ana Torres',
      email: 'ana@correo.com',
      password: 'clave12345',
      carrera: 'Diseño gráfico'
    },
    respuestas: [
      [201, 'Cuenta creada: devuelve { token, usuario }'],
      [400, 'Datos inválidos'],
      [409, 'Ya existe una cuenta con ese correo']
    ]
  },
  {
    grupo: 'Autenticación',
    metodo: 'POST',
    ruta: '/auth/login',
    auth: 'publica',
    resumen: 'Inicia sesión y devuelve el token JWT (dura 8 horas).',
    cuerpo: { email: 'camila@plazau.co', password: 'demo1234' },
    respuestas: [
      [200, 'Sesión iniciada: devuelve { token, usuario }'],
      [400, 'Datos inválidos'],
      [401, 'Correo o contraseña incorrectos']
    ]
  },
  {
    grupo: 'Autenticación',
    metodo: 'GET',
    ruta: '/auth/yo',
    auth: 'sesion',
    resumen: 'Devuelve los datos de la persona dueña del token.',
    respuestas: [
      [200, 'Datos del usuario'],
      [401, 'Sin token o token inválido']
    ]
  },

  {
    grupo: 'Productos',
    metodo: 'GET',
    ruta: '/productos',
    auth: 'publica',
    resumen:
      'Lista los productos. Admite búsqueda, filtro por categoría, orden y paginación. El total viaja en el encabezado X-Total-Count.',
    query: [
      ['q', 'Texto a buscar (ignora tildes y mayúsculas)'],
      ['categoria', 'Una de las categorías de productos'],
      ['orden', 'recientes, precio_asc o precio_desc'],
      ['limite', 'Cuántos devolver (1 a 100, por defecto 50)'],
      ['desde', 'Cuántos saltar (paginación)']
    ],
    respuestas: [
      [200, 'Lista de productos'],
      [400, 'Parámetros inválidos']
    ]
  },
  {
    grupo: 'Productos',
    metodo: 'GET',
    ruta: '/productos/{id}',
    auth: 'publica',
    resumen: 'Devuelve un producto por su id.',
    respuestas: [
      [200, 'El producto'],
      [404, 'No existe']
    ]
  },
  {
    grupo: 'Productos',
    metodo: 'POST',
    ruta: '/productos',
    auth: 'sesion',
    resumen: 'Publica un producto. El dueño es quien tiene la sesión.',
    cuerpo: productoEjemplo,
    respuestas: [
      [201, 'Producto creado (encabezado Location con su dirección)'],
      [400, 'Datos inválidos'],
      [401, 'Sin sesión']
    ]
  },
  {
    grupo: 'Productos',
    metodo: 'PUT',
    ruta: '/productos/{id}',
    auth: 'sesion',
    resumen: 'Reemplaza los datos de un producto. Solo su dueño o un administrador.',
    cuerpo: { ...productoEjemplo, precio: 13000, stock: 20 },
    respuestas: [
      [200, 'Producto actualizado'],
      [400, 'Datos inválidos'],
      [401, 'Sin sesión'],
      [403, 'No eres el dueño'],
      [404, 'No existe']
    ]
  },
  {
    grupo: 'Productos',
    metodo: 'DELETE',
    ruta: '/productos/{id}',
    auth: 'sesion',
    resumen: 'Elimina un producto. Solo su dueño o un administrador.',
    respuestas: [
      [204, 'Eliminado (sin contenido)'],
      [401, 'Sin sesión'],
      [403, 'No eres el dueño'],
      [404, 'No existe']
    ]
  },

  {
    grupo: 'Cursos',
    metodo: 'GET',
    ruta: '/cursos',
    auth: 'publica',
    resumen:
      'Lista los cursos presenciales. Admite búsqueda, filtro por nivel y categoría, orden y paginación.',
    query: [
      ['q', 'Texto a buscar'],
      ['nivel', 'Principiante, Intermedio o Avanzado'],
      ['categoria', 'Una de las categorías de cursos'],
      ['orden', 'recientes, precio_asc o precio_desc'],
      ['limite', 'Cuántos devolver'],
      ['desde', 'Cuántos saltar']
    ],
    respuestas: [
      [200, 'Lista de cursos'],
      [400, 'Parámetros inválidos']
    ]
  },
  {
    grupo: 'Cursos',
    metodo: 'GET',
    ruta: '/cursos/{id}',
    auth: 'publica',
    resumen: 'Devuelve un curso por su id.',
    respuestas: [
      [200, 'El curso'],
      [404, 'No existe']
    ]
  },
  {
    grupo: 'Cursos',
    metodo: 'POST',
    ruta: '/cursos',
    auth: 'sesion',
    resumen: 'Publica un curso. Quien lo crea queda como instructor.',
    cuerpo: cursoEjemplo,
    respuestas: [
      [201, 'Curso creado'],
      [400, 'Datos inválidos'],
      [401, 'Sin sesión']
    ]
  },
  {
    grupo: 'Cursos',
    metodo: 'PUT',
    ruta: '/cursos/{id}',
    auth: 'sesion',
    resumen: 'Reemplaza los datos de un curso. Solo su instructor o un administrador.',
    cuerpo: { ...cursoEjemplo, cupos: 12 },
    respuestas: [
      [200, 'Curso actualizado'],
      [400, 'Datos inválidos'],
      [401, 'Sin sesión'],
      [403, 'No eres el instructor'],
      [404, 'No existe']
    ]
  },
  {
    grupo: 'Cursos',
    metodo: 'DELETE',
    ruta: '/cursos/{id}',
    auth: 'sesion',
    resumen: 'Elimina un curso. Solo su instructor o un administrador.',
    respuestas: [
      [204, 'Eliminado'],
      [401, 'Sin sesión'],
      [403, 'No eres el instructor'],
      [404, 'No existe']
    ]
  },

  {
    grupo: 'Inscripciones',
    metodo: 'POST',
    ruta: '/cursos/{id}/inscripcion',
    auth: 'sesion',
    resumen: 'Inscribe a la persona en el curso y descuenta un cupo.',
    cuerpo: { pago: 'Nequi' },
    respuestas: [
      [201, 'Inscripción creada'],
      [401, 'Sin sesión'],
      [404, 'El curso no existe'],
      [409, 'Ya inscrito, sin cupos o es tu propio curso']
    ]
  },
  {
    grupo: 'Inscripciones',
    metodo: 'DELETE',
    ruta: '/cursos/{id}/inscripcion',
    auth: 'sesion',
    resumen: 'Cancela la inscripción y devuelve el cupo.',
    respuestas: [
      [204, 'Cancelada'],
      [401, 'Sin sesión'],
      [404, 'No estabas inscrito']
    ]
  },
  {
    grupo: 'Inscripciones',
    metodo: 'GET',
    ruta: '/inscripciones',
    auth: 'sesion',
    resumen: 'Lista las inscripciones de la persona, con los datos de cada curso.',
    respuestas: [
      [200, 'Lista de inscripciones'],
      [401, 'Sin sesión']
    ]
  },

  {
    grupo: 'Pedidos',
    metodo: 'POST',
    ruta: '/pedidos',
    auth: 'sesion',
    resumen:
      'Crea los pedidos de un carrito (uno por vendedor) y descuenta el stock, todo en una transacción.',
    cuerpo: {
      items: [
        { productoId: 'p1', cantidad: 2 },
        { productoId: 'p3', cantidad: 1 }
      ],
      cliente: {
        nombre: 'Ana Torres',
        celular: '3001234567',
        direccion: 'Bloque 5, salón 302',
        notas: 'Salgo a las 2 p. m.'
      },
      pago: 'Nequi'
    },
    respuestas: [
      [201, 'Lista de pedidos creados'],
      [400, 'Datos inválidos'],
      [401, 'Sin sesión'],
      [404, 'Un producto no existe'],
      [409, 'Sin stock suficiente o producto propio']
    ]
  },
  {
    grupo: 'Pedidos',
    metodo: 'GET',
    ruta: '/pedidos',
    auth: 'sesion',
    resumen: 'Lista los pedidos donde la persona compra o vende. El administrador ve todos.',
    respuestas: [
      [200, 'Lista de pedidos'],
      [401, 'Sin sesión']
    ]
  },
  {
    grupo: 'Pedidos',
    metodo: 'GET',
    ruta: '/pedidos/{id}',
    auth: 'sesion',
    resumen: 'Devuelve un pedido. Solo su comprador, su vendedor o un administrador.',
    respuestas: [
      [200, 'El pedido'],
      [401, 'Sin sesión'],
      [403, 'No es tu pedido'],
      [404, 'No existe']
    ]
  },
  {
    grupo: 'Pedidos',
    metodo: 'PUT',
    ruta: '/pedidos/{id}/estado',
    auth: 'sesion',
    resumen:
      'Cambia el estado. Se avanza de a un paso (Nuevo, Preparando, En camino, Entregado) o se cancela, y al cancelar se devuelve el stock.',
    cuerpo: { estado: 'Preparando' },
    respuestas: [
      [200, 'Pedido actualizado'],
      [400, 'Estado inválido'],
      [403, 'Sin permiso para ese cambio'],
      [404, 'No existe'],
      [409, 'Salto de estado no permitido o pedido cerrado']
    ]
  },

  {
    grupo: 'Administración',
    metodo: 'GET',
    ruta: '/vendedores',
    auth: 'publica',
    resumen: 'Lista pública de los estudiantes que venden o dictan cursos (sin correo ni WhatsApp).',
    respuestas: [[200, 'Lista de vendedores']]
  },
  {
    grupo: 'Administración',
    metodo: 'GET',
    ruta: '/config',
    auth: 'publica',
    resumen: 'Devuelve el porcentaje de comisión vigente.',
    respuestas: [[200, 'Configuración']]
  },
  {
    grupo: 'Administración',
    metodo: 'PUT',
    ruta: '/config',
    auth: 'admin',
    resumen: 'Cambia el porcentaje de comisión (0 a 20).',
    cuerpo: { comisionPorcentaje: 8 },
    respuestas: [
      [200, 'Configuración actualizada'],
      [400, 'Valor inválido'],
      [401, 'Sin sesión'],
      [403, 'No eres administrador']
    ]
  },
  {
    grupo: 'Administración',
    metodo: 'GET',
    ruta: '/usuarios',
    auth: 'admin',
    resumen: 'Lista todas las cuentas.',
    respuestas: [
      [200, 'Lista de usuarios'],
      [401, 'Sin sesión'],
      [403, 'No eres administrador']
    ]
  },
  {
    grupo: 'Administración',
    metodo: 'DELETE',
    ruta: '/usuarios/{id}',
    auth: 'admin',
    resumen: 'Elimina una cuenta de estudiante con sus productos, cursos e inscripciones.',
    respuestas: [
      [204, 'Eliminada'],
      [401, 'Sin sesión'],
      [403, 'No eres administrador'],
      [404, 'No existe'],
      [409, 'No se puede eliminar a un administrador']
    ]
  }
];
