// Llamadas a la API de Plaza U (el backend en Express).
// En desarrollo, Vite redirige /api hacia http://localhost:3000 (ver vite.config.js).
const BASE = import.meta.env.VITE_API_URL ?? '/api';

async function pedir(ruta) {
  const respuesta = await fetch(`${BASE}${ruta}`);
  if (!respuesta.ok) throw new Error(`La API respondió ${respuesta.status}`);
  return respuesta.json();
}

// Trae el catálogo completo en paralelo: productos, cursos y los estudiantes que venden
export async function cargarCatalogo() {
  const [productos, cursos, vendedores] = await Promise.all([
    pedir('/productos?limite=100'),
    pedir('/cursos?limite=100'),
    pedir('/vendedores')
  ]);
  return { productos, cursos, vendedores };
}
