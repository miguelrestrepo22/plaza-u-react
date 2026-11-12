// Busca en una lista el elemento que tenga ese id (sirve para vendedores, productos y cursos)
export function buscarPorId(lista, id) {
  return lista.find(elemento => elemento.id === id);
}
