import { useState } from 'react';
import Buscador from '../components/Buscador.jsx';
import Chips from '../components/Chips.jsx';
import EstadoVacio from '../components/EstadoVacio.jsx';
import TarjetaCurso from '../components/TarjetaCurso.jsx';
import { NIVELES } from '../data/categorias.js';
import { buscarPorId } from '../utils/buscar.js';
import { normalizar } from '../utils/formato.js';

// Cursos presenciales: se pueden buscar, filtrar por nivel e inscribirse.
function Cursos({ cursos, instructores, inscripciones, onInscribirse }) {
  const [texto, setTexto] = useState('');
  const [nivel, setNivel] = useState('');

  const visibles = cursos.filter(curso => {
    const coincideNivel = nivel === '' || curso.nivel === nivel;
    const contenido = normalizar(`${curso.titulo} ${curso.descripcion} ${curso.categoria}`);
    return coincideNivel && contenido.includes(normalizar(texto));
  });

  // De todos los cursos, nos quedamos con los que la persona ya tomó
  const misCursos = cursos.filter(curso => inscripciones.includes(curso.id));

  return (
    <section className="contenedor seccion">
      <h1 className="titulo-pagina">Cursos de estudiantes</h1>
      <p className="subtitulo">Todos son presenciales y se dictan dentro de la universidad.</p>

      <Buscador
        valor={texto}
        onCambio={setTexto}
        etiqueta="Buscar cursos"
        placeholder="Busca React, guitarra, Excel…"
      />
      <Chips
        opciones={NIVELES}
        seleccionada={nivel}
        onSeleccionar={setNivel}
        textoTodas="Todos los niveles"
      />

      <p className="contador-resultados">{visibles.length} cursos</p>

      {visibles.length === 0 ? (
        <EstadoVacio
          mensaje="Ningún curso coincide con esos filtros."
          textoBoton="Limpiar filtros"
          onLimpiar={() => {
            setTexto('');
            setNivel('');
          }}
        />
      ) : (
        <div className="cuadricula">
          {visibles.map(curso => (
            <TarjetaCurso
              key={curso.id}
              curso={curso}
              instructor={buscarPorId(instructores, curso.instructorId)}
              inscrito={inscripciones.includes(curso.id)}
              onInscribirse={onInscribirse}
            />
          ))}
        </div>
      )}

      <div className="mis-cursos">
        <h2>Mis inscripciones</h2>
        {misCursos.length === 0 ? (
          <p className="subtitulo">Todavía no te has inscrito a ningún curso.</p>
        ) : (
          <ul>
            {misCursos.map(curso => (
              <li key={curso.id}>
                <strong>{curso.titulo}</strong> · {curso.horario}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default Cursos;
