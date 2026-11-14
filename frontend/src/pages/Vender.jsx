import FormularioProducto from '../components/FormularioProducto.jsx';
import { formatoPesos } from '../utils/formato.js';

// Aquí un estudiante publica sus productos y ve (y elimina) los que ya publicó.
function Vender({ misProductos, onPublicar, onEliminar }) {
  return (
    <section className="contenedor seccion">
      <h1 className="titulo-pagina">Abre tu puesto</h1>
      <p className="subtitulo">Publica un producto y aparecerá en el mercadito. Es gratis.</p>

      <div className="vender-grid">
        <FormularioProducto onPublicar={onPublicar} />

        <div className="mis-productos">
          <h2>Mis productos</h2>
          {misProductos.length === 0 ? (
            <p className="subtitulo">Todavía no has publicado nada.</p>
          ) : (
            <ul>
              {misProductos.map(producto => (
                <li key={producto.id}>
                  <div>
                    <strong>{producto.nombre}</strong>
                    <span>
                      {producto.categoria} · {formatoPesos(producto.precio)} · {producto.stock}{' '}
                      unidades
                    </span>
                  </div>
                  <button className="quitar" onClick={() => onEliminar(producto.id)}>
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

export default Vender;
