// Fila de botones para filtrar. La usamos en el mercadito (categorías) y en los cursos (niveles).
function Chips({ opciones, seleccionada, onSeleccionar, textoTodas }) {
  return (
    <div className="chips" role="group">
      <button
        className={seleccionada === '' ? 'chip activo' : 'chip'}
        onClick={() => onSeleccionar('')}
      >
        {textoTodas}
      </button>

      {opciones.map(opcion => (
        <button
          key={opcion}
          className={seleccionada === opcion ? 'chip activo' : 'chip'}
          onClick={() => onSeleccionar(opcion)}
        >
          {opcion}
        </button>
      ))}
    </div>
  );
}

export default Chips;
