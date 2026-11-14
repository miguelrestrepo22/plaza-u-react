// Muestra un número como pesos colombianos, por ejemplo 24000 -> $ 24.000
export function formatoPesos(valor) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(valor);
}

// Quita tildes y pasa a minúsculas para que la búsqueda no distinga "café" de "Cafe"
export function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}
