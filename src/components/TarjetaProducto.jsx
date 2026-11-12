import { formatoPesos } from '../utils/formato.js';

// Tarjeta de un producto. Se reutiliza en el inicio y en el mercadito.
// Recibe el producto, su vendedor y la función que se ejecuta al pulsar "Agregar".
function TarjetaProducto({ producto, vendedor, onAgregar }) {
  const agotado = producto.stock === 0;
  const pocas = producto.stock > 0 && producto.stock <= 5;

  return (
    <article className="tarjeta">
      <img src={producto.foto} alt={producto.nombre} loading="lazy" />
      <div className="tarjeta-cuerpo">
        <span className="etiqueta">{agotado ? 'Agotado' : producto.categoria}</span>
        <h3>{producto.nombre}</h3>
        <p className="vendedor">{vendedor ? vendedor.nombre : 'Vendedor'}</p>
        <p className="detalle">{pocas ? `Quedan ${producto.stock}` : 'Entrega en el campus'}</p>
        <div className="tarjeta-pie">
          <strong className="precio">{formatoPesos(producto.precio)}</strong>
          <button
            className="boton boton-verde"
            disabled={agotado}
            onClick={() => onAgregar(producto.id)}
          >
            {agotado ? 'Agotado' : 'Agregar'}
          </button>
        </div>
      </div>
    </article>
  );
}

export default TarjetaProducto;
