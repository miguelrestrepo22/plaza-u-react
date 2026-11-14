// Datos de ejemplo para que la API tenga con qué responder desde el primer arranque.
// Las claves se guardan con hash (bcrypt) al sembrar; acá solo están para poder crear las cuentas de prueba.

export const usuariosEjemplo = [
  {
    id: 'u_admin',
    nombre: 'Administración Plaza U',
    email: 'admin@plazau.co',
    clave: 'admin123',
    rol: 'admin',
    carrera: 'Coordinación',
    whatsapp: '3000000000',
    negocio: ''
  },
  {
    id: 'u_andres',
    nombre: 'Andrés Mejía',
    email: 'andres@plazau.co',
    clave: 'demo1234',
    rol: 'estudiante',
    carrera: 'Licenciatura en música',
    whatsapp: '3015550101',
    negocio: 'Hilo & Mano'
  },
  {
    id: 'u_camila',
    nombre: 'Camila Restrepo',
    email: 'camila@plazau.co',
    clave: 'demo1234',
    rol: 'estudiante',
    carrera: 'Diseño industrial',
    whatsapp: '3015550102',
    negocio: 'Luz de Camila'
  },
  {
    id: 'u_daniel',
    nombre: 'Daniel Cárdenas',
    email: 'daniel@plazau.co',
    clave: 'demo1234',
    rol: 'estudiante',
    carrera: 'Ingeniería de sistemas',
    whatsapp: '3015550103',
    negocio: ''
  },
  {
    id: 'u_laura',
    nombre: 'Laura Gómez',
    email: 'laura@plazau.co',
    clave: 'demo1234',
    rol: 'estudiante',
    carrera: 'Comunicación gráfica',
    whatsapp: '3015550104',
    negocio: 'Estampa Viva'
  },
  {
    id: 'u_mariana',
    nombre: 'Mariana Londoño',
    email: 'mariana@plazau.co',
    clave: 'demo1234',
    rol: 'estudiante',
    carrera: 'Ingeniería ambiental',
    whatsapp: '3015550105',
    negocio: 'Verde Mariana'
  },
  {
    id: 'u_sebastian',
    nombre: 'Sebastián Duarte',
    email: 'sebastian@plazau.co',
    clave: 'demo1234',
    rol: 'estudiante',
    carrera: 'Administración',
    whatsapp: '3015550106',
    negocio: 'Origen 1800'
  },
  {
    id: 'u_valentina',
    nombre: 'Valentina Ortiz',
    email: 'valentina@plazau.co',
    clave: 'demo1234',
    rol: 'estudiante',
    carrera: 'Gastronomía',
    whatsapp: '3015550107',
    negocio: 'Dulce Vale'
  }
];

export const productosEjemplo = [
  {
    id: 'p1',
    owner_id: 'u_camila',
    nombre: 'Vela de soya Lavanda y Vainilla',
    categoria: 'Velas y hogar',
    precio: 24000,
    stock: 15,
    descripcion:
      'Vela de soya 100% natural en frasco de vidrio reutilizable. 180 g, dura cerca de 35 horas. Mecha de algodón y fragancia suave que no marea.',
    imagen: '/fotos/velas.jpg'
  },
  {
    id: 'p2',
    owner_id: 'u_andres',
    nombre: 'Oso Teo tejido a mano (crochet)',
    categoria: 'Artesanías',
    precio: 48000,
    stock: 6,
    descripcion:
      'Muñeco de 22 cm tejido en crochet con hilo de algodón hipoalergénico. Lo hago por encargo en el color de bufanda que prefieras.',
    imagen: '/fotos/amigurumi.jpg'
  },
  {
    id: 'p3',
    owner_id: 'u_valentina',
    nombre: 'Caja de 6 brownies de chocolate',
    categoria: 'Comida',
    precio: 28000,
    stock: 22,
    descripcion:
      'Brownies húmedos con nueces y cobertura de chocolate semiamargo. Se hornean el mismo día del despacho.',
    imagen: '/fotos/brownies.jpg'
  },
  {
    id: 'p4',
    owner_id: 'u_sebastian',
    nombre: 'Café de origen Antioquia, 250 g',
    categoria: 'Comida',
    precio: 22000,
    stock: 37,
    descripcion:
      'Café de finca en grano o molido. Tueste medio, notas a panela y cacao. Indica en las notas si lo quieres molido para filtro o prensa.',
    imagen: '/fotos/cafe.jpg'
  },
  {
    id: 'p5',
    owner_id: 'u_laura',
    nombre: 'Tote bag ilustrada «Sol de Cali»',
    categoria: 'Moda',
    precio: 35000,
    stock: 13,
    descripcion:
      'Tote de lona 100% algodón con estampado serigrafiado a mano. Mide 38 x 40 cm y aguanta el portátil y los libros.',
    imagen: '/fotos/tote.jpg'
  },
  {
    id: 'p6',
    owner_id: 'u_mariana',
    nombre: 'Pulseras de chaquira, set de 3',
    categoria: 'Accesorios',
    precio: 18000,
    stock: 30,
    descripcion:
      'Tres pulseras elásticas de chaquira en colores combinables. Talla única, ajustan de 15 a 19 cm de muñeca.',
    imagen: '/fotos/pulseras.jpg'
  },
  {
    id: 'p7',
    owner_id: 'u_laura',
    nombre: 'Pack de stickers y mini planner',
    categoria: 'Papelería',
    precio: 15000,
    stock: 48,
    descripcion:
      'Hoja de 20 stickers resistentes al agua y un mini planner semanal de 40 páginas. Ilustrado por mí.',
    imagen: '/fotos/stickers.jpg'
  },
  {
    id: 'p8',
    owner_id: 'u_mariana',
    nombre: 'Suculentas en macetero de barro',
    categoria: 'Plantas',
    precio: 16000,
    stock: 20,
    descripcion:
      'Suculenta lista para tu escritorio en macetero de barro de 8 cm. Incluye tarjeta con cuidados básicos.',
    imagen: '/fotos/suculentas.jpg'
  },
  {
    id: 'p9',
    owner_id: 'u_mariana',
    nombre: 'Jabones artesanales, set de 3',
    categoria: 'Cuidado personal',
    precio: 21000,
    stock: 19,
    descripcion: 'Jabones en barra de glicerina vegetal: lavanda, menta y limón. Cada barra pesa unos 90 g.',
    imagen: '/fotos/jabones.jpg'
  },
  {
    id: 'p10',
    owner_id: 'u_laura',
    nombre: 'Camiseta estampada edición universidad',
    categoria: 'Moda',
    precio: 55000,
    stock: 11,
    descripcion:
      'Camiseta de algodón peinado con estampado en vinilo. Tallas S a XL; escribe tu talla en las notas del pedido.',
    imagen: '/fotos/camiseta.jpg'
  },
  {
    id: 'p11',
    owner_id: 'u_laura',
    nombre: 'Funda de celular personalizada',
    categoria: 'Tecnología',
    precio: 30000,
    stock: 16,
    descripcion:
      'Funda de silicona con diseño a tu gusto. Dime el modelo de tu celular y el diseño; te mando una vista previa antes de producir.',
    imagen: '/fotos/funda.jpg'
  },
  {
    id: 'p12',
    owner_id: 'u_valentina',
    nombre: 'Empanadas de carne x12 (congeladas)',
    categoria: 'Comida',
    precio: 26000,
    stock: 14,
    descripcion: 'Doce empanadas listas para freír, con carne y papa criolla. Vienen con ají casero.',
    imagen: '/fotos/empanadas.jpg'
  }
];

export const cursosEjemplo = [
  {
    id: 'c1',
    owner_id: 'u_daniel',
    titulo: 'React desde cero: tu primera app',
    categoria: 'Programación',
    nivel: 'Intermedio',
    precio: 60000,
    cupos: 17,
    horario: 'Sábados, 9:00 a. m. · Bloque 12, sala de cómputo',
    duracion: '4 sesiones de 2 horas',
    descripcion:
      'Aprende a construir una app con componentes, estado y formularios, igual que en clase pero con un proyecto propio que puedas mostrar.',
    temario: [
      'Componentes y JSX',
      'useState y eventos',
      'Listas, formularios y validaciones',
      'Consumir una API con fetch'
    ],
    imagen: '/fotos/react.jpg'
  },
  {
    id: 'c2',
    owner_id: 'u_daniel',
    titulo: 'JavaScript para principiantes',
    categoria: 'Programación',
    nivel: 'Principiante',
    precio: 45000,
    cupos: 23,
    horario: 'Martes y jueves, 7:00 p. m. · Bloque 12, sala de cómputo',
    duracion: '6 sesiones de 1,5 horas',
    descripcion:
      'Variables, funciones, arreglos y manipulación del DOM con ejercicios cortos. No necesitas experiencia previa.',
    temario: [
      'let, var y tipos de datos',
      'Estructuras de control',
      'Funciones, arreglos y objetos',
      'El DOM y los eventos'
    ],
    imagen: '/fotos/js.jpg'
  },
  {
    id: 'c3',
    owner_id: 'u_daniel',
    titulo: 'API REST con Node.js y Express',
    categoria: 'Programación',
    nivel: 'Avanzado',
    precio: 90000,
    cupos: 14,
    horario: 'Viernes, 4:00 p. m. · Bloque 12, sala de cómputo',
    duracion: '5 sesiones de 2 horas',
    descripcion:
      'Construye un backend con CRUD, base de datos con ORM, autenticación con JWT y roles de usuario.',
    temario: ['Rutas y controladores', 'CRUD con Sequelize', 'Login y tokens JWT', 'Roles y autorización'],
    imagen: '/fotos/node.jpg'
  },
  {
    id: 'c4',
    owner_id: 'u_sebastian',
    titulo: 'Excel para emprendedores',
    categoria: 'Negocios',
    nivel: 'Principiante',
    precio: 30000,
    cupos: 17,
    horario: 'Viernes, 2:00 p. m. · Bloque 8, salón 204',
    duracion: '3 sesiones de 2 horas',
    descripcion:
      'Controla inventario, costos y utilidades de tu emprendimiento con hojas de cálculo y gráficos sencillos.',
    temario: ['Inventario y precios', 'Costos y margen de ganancia', 'Tablas dinámicas básicas'],
    imagen: '/fotos/excel.jpg'
  },
  {
    id: 'c5',
    owner_id: 'u_camila',
    titulo: 'Inglés conversacional A2',
    categoria: 'Idiomas',
    nivel: 'Principiante',
    precio: 40000,
    cupos: 11,
    horario: 'Miércoles, 6:30 p. m. · Bloque 3, salón 105',
    duracion: '8 sesiones de 1 hora',
    descripcion: 'Practica hablar desde la primera clase: presentarte, pedir cosas y conversar sobre tu día.',
    temario: [
      'Presentaciones y rutina diaria',
      'Compras y comida',
      'Preguntas y direcciones',
      'Conversación libre'
    ],
    imagen: '/fotos/ingles.jpg'
  },
  {
    id: 'c6',
    owner_id: 'u_andres',
    titulo: 'Guitarra desde cero',
    categoria: 'Música',
    nivel: 'Principiante',
    precio: 50000,
    cupos: 9,
    horario: 'Sábados, 3:00 p. m. · Aula de música',
    duracion: '6 sesiones de 1 hora',
    descripcion:
      'Acordes básicos, ritmo y tus primeras tres canciones. Si no tienes guitarra, te prestamos una en clase.',
    temario: ['Postura y afinación', 'Acordes abiertos', 'Rasgueos y ritmo', 'Tres canciones completas'],
    imagen: '/fotos/guitarra.jpg'
  },
  {
    id: 'c7',
    owner_id: 'u_laura',
    titulo: 'Diseña tu logo con Canva',
    categoria: 'Diseño',
    nivel: 'Principiante',
    precio: 25000,
    cupos: 29,
    horario: 'Jueves, 5:00 p. m. · Bloque 5, laboratorio de diseño',
    duracion: '2 sesiones de 2 horas',
    descripcion:
      'Crea la identidad básica de tu emprendimiento: logo, paleta de colores y plantilla para redes.',
    temario: ['Qué hace bueno a un logo', 'Colores y tipografías', 'Exportar para redes y empaques'],
    imagen: '/fotos/logos.jpg'
  },
  {
    id: 'c8',
    owner_id: 'u_valentina',
    titulo: 'Repostería básica: tortas y cupcakes',
    categoria: 'Gastronomía',
    nivel: 'Principiante',
    precio: 70000,
    cupos: 7,
    horario: 'Sábados, 10:00 a. m. · Bloque 2, cocina de gastronomía',
    duracion: '3 sesiones de 3 horas',
    descripcion:
      'Prepara masas, cremas y decoraciones. Te llevas todo lo que hornees. Ingredientes incluidos.',
    temario: ['Masa base y horneado', 'Cremas y rellenos', 'Decoración con manga'],
    imagen: '/fotos/reposteria.jpg'
  }
];
