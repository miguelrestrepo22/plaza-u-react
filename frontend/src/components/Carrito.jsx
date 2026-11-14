import { formatoPesos } from '../utils/formato.js';

// Panel lateral del carrito. Todo lo que muestra viene por props; el estado vive en App.jsx.
function Carrito({ abierto, items, onCerrar, onCambiarCantidad, onQuitar, onFinalizar }) {
  if (!abierto) return null;

  // reduce suma el precio por la cantidad de cada producto
  const total = items.reduce((suma, item) => suma + item.precio * item.cantidad, 0);

  return (
    <div className="velo" onClick={onCerrar}>
      <aside
        className="carrito"
        role="dialog"
        aria-label="Carrito de compras"
        onClick={evento => evento.stopPropagation()}
      >
        <div className="carrito-cabecera">
          <h2>Tu carrito</h2>
          <button className="boton-cerrar" onClick={onCerrar} aria-label="Cerrar el carrito">
            ×
          </button>
        </div>

        {items.length === 0 ? (
          <p className="carrito-vacio">Todavía no has agregado nada.</p>
        ) : (
          <ul className="carrito-lista">
            {items.map(item => (
              <li key={item.id} className="carrito-item">
                <img src={item.foto} alt="" />
                <div className="carrito-datos">
                  <strong>{item.nombre}</strong>
                  <span>{formatoPesos(item.precio)} c/u</span>
                  <div className="cantidad">
                    <button onClick={() => onCambiarCantidad(item.id, -1)} aria-label="Menos">
                      −
                    </button>
                    <span>{item.cantidad}</span>
                    <button onClick={() => onCambiarCantidad(item.id, 1)} aria-label="Más">
                      +
                    </button>
                    <button className="quitar" onClick={() => onQuitar(item.id)}>
                      Quitar
                    </button>
                  </div>
                </div>
                <strong>{formatoPesos(item.precio * item.cantidad)}</strong>
              </li>
            ))}
          </ul>
        )}

        <div className="carrito-total">
          <span>Total</span>
          <strong>{formatoPesos(total)}</strong>
        </div>
        <button
          className="boton boton-barro boton-ancho"
          disabled={items.length === 0}
          onClick={onFinalizar}
        >
          Finalizar pedido
        </button>
        <p className="carrito-nota">Entrega solo dentro de la universidad. Pedido simulado.</p>
      </aside>
    </div>
  );
}

export default Carrito;
