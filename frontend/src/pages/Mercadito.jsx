import { useState } from 'react';
import Buscador from '../components/Buscador.jsx';
import Chips from '../components/Chips.jsx';
import EstadoVacio from '../components/EstadoVacio.jsx';
import TarjetaProducto from '../components/TarjetaProducto.jsx';
import { CATEGORIAS } from '../data/categorias.js';
import { buscarPorId } from '../utils/buscar.js';
import { normalizar } from '../utils/formato.js';

// Las tres formas de ordenar. "recientes" no mueve nada: respeta el orden del arreglo.
const ORDENES = {
  recientes: () => 0,
  menor: (a, b) => a.precio - b.precio,
  mayor: (a, b) => b.precio - a.precio
};

// Catálogo completo con buscador, filtro por categoría y orden.
function Mercadito({ productos, vendedores, onAgregar }) {
  const [texto, setTexto] = useState('');
  const [categoria, setCategoria] = useState('');
  const [orden, setOrden] = useState('recientes');

  // Primero filtramos por categoría y por texto; después ordenamos una copia del resultado
  const visibles = productos.filter(producto => {
    const coincideCategoria = categoria === '' || producto.categoria === categoria;
    const contenido = normalizar(
      `${producto.nombre} ${producto.descripcion} ${producto.categoria}`
    );
    return coincideCategoria && contenido.includes(normalizar(texto));
  });
  const ordenados = [...visibles].sort(ORDENES[orden]);

  function limpiarFiltros() {
    setTexto('');
    setCategoria('');
  }

  return (
    <section className="contenedor seccion">
      <h1 className="titulo-pagina">El mercadito</h1>
      <p className="subtitulo">Productos hechos por estudiantes, con entrega dentro del campus.</p>

      <div className="barra-filtros">
        <Buscador
          valor={texto}
          onCambio={setTexto}
          etiqueta="Buscar productos"
          placeholder="Busca velas, café, tote…"
        />
        <label className="orden">
          <span className="solo-lectores">Ordenar por</span>
          <select value={orden} onChange={evento => setOrden(evento.target.value)}>
            <option value="recientes">Más nuevos</option>
            <option value="menor">Precio: menor a mayor</option>
            <option value="mayor">Precio: mayor a menor</option>
          </select>
        </label>
      </div>

      <Chips
        opciones={CATEGORIAS}
        seleccionada={categoria}
        onSeleccionar={setCategoria}
        textoTodas="Todas"
      />

      <p className="contador-resultados">{ordenados.length} productos</p>

      {ordenados.length === 0 ? (
        <EstadoVacio
          mensaje="No encontramos productos con esos filtros."
          textoBoton="Limpiar filtros"
          onLimpiar={limpiarFiltros}
        />
      ) : (
        <div className="cuadricula">
          {ordenados.map(producto => (
            <TarjetaProducto
              key={producto.id}
              producto={producto}
              vendedor={buscarPorId(vendedores, producto.vendedorId)}
              onAgregar={onAgregar}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default Mercadito;
