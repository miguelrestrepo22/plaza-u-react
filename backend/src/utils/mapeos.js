// Pasan las filas de la base de datos (snake_case) al formato que devuelve la API (camelCase).
export const usuarioApi = fila => ({
  id: fila.id,
  nombre: fila.nombre,
  email: fila.email,
  rol: fila.rol,
  carrera: fila.carrera,
  whatsapp: fila.whatsapp,
  negocio: fila.negocio,
  creado: fila.creado
});

// Versión pública: sin correo ni WhatsApp
export const vendedorApi = fila => ({
  id: fila.id,
  nombre: fila.nombre,
  carrera: fila.carrera,
  negocio: fila.negocio
});

export const productoApi = fila => ({
  id: fila.id,
  nombre: fila.nombre,
  categoria: fila.categoria,
  precio: fila.precio,
  stock: fila.stock,
  descripcion: fila.descripcion,
  foto: fila.imagen,
  vendedorId: fila.owner_id,
  creado: fila.creado
});

export const cursoApi = fila => ({
  id: fila.id,
  titulo: fila.titulo,
  categoria: fila.categoria,
  nivel: fila.nivel,
  precio: fila.precio,
  cupos: fila.cupos,
  horario: fila.horario,
  duracion: fila.duracion,
  descripcion: fila.descripcion,
  temario: fila.temario,
  foto: fila.imagen,
  instructorId: fila.owner_id,
  creado: fila.creado
});

export const pedidoApi = fila => ({
  id: fila.id,
  compradorId: fila.comprador_id,
  vendedorId: fila.vendedor_id,
  items: fila.items,
  total: fila.total,
  comision: fila.comision,
  pago: fila.pago,
  estado: fila.estado,
  cliente: fila.cliente,
  creado: fila.creado,
  actualizado: fila.actualizado
});

export const inscripcionApi = fila => ({
  id: fila.id,
  cursoId: fila.curso_id,
  usuarioId: fila.usuario_id,
  precio: fila.precio,
  comision: fila.comision,
  pago: fila.pago,
  creado: fila.creado
});

// Quita tildes y pasa a minúsculas para que buscar "cafe" encuentre "Café"
export const normalizarTexto = texto =>
  String(texto)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
