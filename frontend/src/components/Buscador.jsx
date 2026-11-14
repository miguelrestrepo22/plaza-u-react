// Campo de búsqueda controlado: lo que se ve en el input siempre viene del estado de la página.
function Buscador({ valor, onCambio, etiqueta, placeholder }) {
  return (
    <div className="buscador">
      <label htmlFor="buscador" className="solo-lectores">
        {etiqueta}
      </label>
      <input
        id="buscador"
        type="search"
        value={valor}
        placeholder={placeholder}
        onChange={evento => onCambio(evento.target.value)}
      />
    </div>
  );
}

export default Buscador;
