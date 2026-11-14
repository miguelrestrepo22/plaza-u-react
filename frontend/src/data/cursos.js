// Cursos presenciales de ejemplo. El instructor se busca con instructorId.
export const cursosIniciales = [
  {
    id: 'c1',
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
    foto: '/fotos/react.jpg',
    instructorId: 'daniel'
  },
  {
    id: 'c2',
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
    foto: '/fotos/js.jpg',
    instructorId: 'daniel'
  },
  {
    id: 'c3',
    titulo: 'API REST con Node.js y Express',
    categoria: 'Programación',
    nivel: 'Avanzado',
    precio: 90000,
    cupos: 14,
    horario: 'Viernes, 4:00 p. m. · Bloque 12, sala de cómputo',
    duracion: '5 sesiones de 2 horas',
    descripcion:
      'Construye un backend con CRUD, base de datos con ORM, autenticación con JWT y roles de usuario.',
    temario: [
      'Rutas y controladores',
      'CRUD con Sequelize',
      'Login y tokens JWT',
      'Roles y autorización'
    ],
    foto: '/fotos/node.jpg',
    instructorId: 'daniel'
  },
  {
    id: 'c4',
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
    foto: '/fotos/excel.jpg',
    instructorId: 'sebastian'
  },
  {
    id: 'c5',
    titulo: 'Inglés conversacional A2',
    categoria: 'Idiomas',
    nivel: 'Principiante',
    precio: 40000,
    cupos: 11,
    horario: 'Miércoles, 6:30 p. m. · Bloque 3, salón 105',
    duracion: '8 sesiones de 1 hora',
    descripcion:
      'Practica hablar desde la primera clase: presentarte, pedir cosas y conversar sobre tu día.',
    temario: [
      'Presentaciones y rutina diaria',
      'Compras y comida',
      'Preguntas y direcciones',
      'Conversación libre'
    ],
    foto: '/fotos/ingles.jpg',
    instructorId: 'camila'
  },
  {
    id: 'c6',
    titulo: 'Guitarra desde cero',
    categoria: 'Música',
    nivel: 'Principiante',
    precio: 50000,
    cupos: 9,
    horario: 'Sábados, 3:00 p. m. · Aula de música',
    duracion: '6 sesiones de 1 hora',
    descripcion:
      'Acordes básicos, ritmo y tus primeras tres canciones. Si no tienes guitarra, te prestamos una en clase.',
    temario: [
      'Postura y afinación',
      'Acordes abiertos',
      'Rasgueos y ritmo',
      'Tres canciones completas'
    ],
    foto: '/fotos/guitarra.jpg',
    instructorId: 'andres'
  },
  {
    id: 'c7',
    titulo: 'Diseña tu logo con Canva',
    categoria: 'Diseño',
    nivel: 'Principiante',
    precio: 25000,
    cupos: 29,
    horario: 'Jueves, 5:00 p. m. · Bloque 5, laboratorio de diseño',
    duracion: '2 sesiones de 2 horas',
    descripcion:
      'Crea la identidad básica de tu emprendimiento: logo, paleta de colores y plantilla para redes.',
    temario: [
      'Qué hace bueno a un logo',
      'Colores y tipografías',
      'Exportar para redes y empaques'
    ],
    foto: '/fotos/logos.jpg',
    instructorId: 'laura'
  },
  {
    id: 'c8',
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
    foto: '/fotos/reposteria.jpg',
    instructorId: 'valentina'
  }
];
