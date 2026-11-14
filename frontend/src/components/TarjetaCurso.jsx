import { formatoPesos } from '../utils/formato.js';

// Tarjeta de un curso. El botón cambia según si ya te inscribiste o si no quedan cupos.
function TarjetaCurso({ curso, instructor, inscrito, onInscribirse }) {
  const sinCupos = curso.cupos === 0;

  let textoBoton = 'Inscribirme';
  if (inscrito) textoBoton = 'Inscrito ✓';
  else if (sinCupos) textoBoton = 'Sin cupos';

  return (
    <article className="tarjeta">
      <img src={curso.foto} alt={curso.titulo} loading="lazy" />
      <div className="tarjeta-cuerpo">
        <span className="etiqueta">
          {curso.categoria} · {curso.nivel}
        </span>
        <h3>{curso.titulo}</h3>
        <p className="vendedor">{instructor ? instructor.nombre : 'Instructor'}</p>
        <p className="detalle">
          {curso.horario}
          <br />
          {curso.duracion} · {sinCupos ? 'sin cupos' : `${curso.cupos} cupos`}
        </p>
        <div className="tarjeta-pie">
          <strong className="precio">{formatoPesos(curso.precio)}</strong>
          <button
            className="boton boton-verde"
            disabled={inscrito || sinCupos}
            onClick={() => onInscribirse(curso.id)}
          >
            {textoBoton}
          </button>
        </div>
      </div>
    </article>
  );
}

export default TarjetaCurso;
