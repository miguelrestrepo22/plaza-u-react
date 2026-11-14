// Listas de valores permitidos. Las usan los validadores y los servicios.
export const CATEGORIAS = [
  'Comida',
  'Artesanías',
  'Velas y hogar',
  'Moda',
  'Accesorios',
  'Papelería',
  'Plantas',
  'Cuidado personal',
  'Tecnología'
];
export const CAT_CURSOS = ['Programación', 'Negocios', 'Idiomas', 'Música', 'Diseño', 'Gastronomía'];
export const NIVELES = ['Principiante', 'Intermedio', 'Avanzado'];
export const PAGOS = ['Contra entrega', 'Nequi', 'Transferencia Bancolombia'];

// El orden importa: es el camino que sigue un pedido. "Cancelado" es una salida, no un paso.
export const ESTADOS_PEDIDO = ['Nuevo', 'Preparando', 'En camino', 'Entregado'];
export const ESTADOS = [...ESTADOS_PEDIDO, 'Cancelado'];

export const ROLES = ['estudiante', 'admin'];
export const COMISION_POR_DEFECTO = 10; // porcentaje que cobra Plaza U
export const COMISION_MAXIMA = 20;
export const IMAGEN_POR_DEFECTO = '/fotos/suculentas.jpg';
