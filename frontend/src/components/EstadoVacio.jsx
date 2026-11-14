// Mensaje que se muestra cuando una búsqueda o un filtro no encuentra nada.
function EstadoVacio({ mensaje, textoBoton, onLimpiar }) {
  return (
    <div className="vacio">
      <p>{mensaje}</p>
      {onLimpiar && (
        <button className="boton boton-borde" onClick={onLimpiar}>
          {textoBoton}
        </button>
      )}
    </div>
  );
}

export default EstadoVacio;
