// Estudiantes que venden productos o dictan cursos (datos de ejemplo, no hay base de datos).
export const vendedores = [
  {
    id: 'andres',
    nombre: 'Andrés Mejía',
    carrera: 'Licenciatura en música',
    negocio: 'Hilo & Mano'
  },
  {
    id: 'camila',
    nombre: 'Camila Restrepo',
    carrera: 'Diseño industrial',
    negocio: 'Luz de Camila'
  },
  {
    id: 'daniel',
    nombre: 'Daniel Cárdenas',
    carrera: 'Ingeniería de sistemas',
    negocio: ''
  },
  {
    id: 'laura',
    nombre: 'Laura Gómez',
    carrera: 'Comunicación gráfica',
    negocio: 'Estampa Viva'
  },
  {
    id: 'mariana',
    nombre: 'Mariana Londoño',
    carrera: 'Ingeniería ambiental',
    negocio: 'Verde Mariana'
  },
  {
    id: 'sebastian',
    nombre: 'Sebastián Duarte',
    carrera: 'Administración',
    negocio: 'Origen 1800'
  },
  {
    id: 'valentina',
    nombre: 'Valentina Ortiz',
    carrera: 'Gastronomía',
    negocio: 'Dulce Vale'
  },
  {
    id: 'yo',
    nombre: 'Tu puesto',
    carrera: '',
    negocio: 'Tu puesto'
  }
];

// La persona que usa la app aparece como vendedora de lo que publica en la pestaña «Vender»
export const TU_PUESTO = { id: 'yo', nombre: 'Tu puesto', carrera: '', negocio: 'Tu puesto' };
