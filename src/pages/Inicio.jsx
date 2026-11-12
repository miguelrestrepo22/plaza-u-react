import TarjetaProducto from '../components/TarjetaProducto.jsx';
import TarjetaCurso from '../components/TarjetaCurso.jsx';
import { buscarPorId } from '../utils/buscar.js';

const PASOS = [
  {
    titulo: 'Explora',
    texto: 'Mira lo que hacen tus compañeros: comida, velas, artesanías, ropa y más.'
  },
  { titulo: 'Pide', texto: 'Agrega al carrito, elige cuántas unidades y finaliza tu pedido.' },
  {
    titulo: 'Recibe en el campus',
    texto: 'Las entregas y las clases son solo dentro de la universidad.'
  }
];

// Página de inicio: portada, lo más nuevo del mercadito, cursos y cómo funciona.
function Inicio({
  productos,
  cursos,
  vendedores,
  inscripciones,
  onNavegar,
  onAgregar,
  onInscribirse
}) {
  // slice(0, 4) toma los primeros cuatro; luego map dibuja una tarjeta por cada uno
  const destacados = productos.slice(0, 4);
  const cursosDestacados = cursos.slice(0, 3);

  return (
    <>
      <section className="portada">
        <div className="contenedor portada-fila">
          <div>
            <h1>Compra lo que hacen tus compañeros. Aprende lo que saben.</h1>
            <p>
              Plaza U es el mercadito y la escuela de la universidad: productos hechos a mano y
              cursos dictados por estudiantes, con entregas y clases dentro del campus.
            </p>
            <div className="botones">
              <button className="boton boton-barro" onClick={() => onNavegar('mercadito')}>
                Ver el mercadito
              </button>
              <button className="boton boton-borde" onClick={() => onNavegar('cursos')}>
                Explorar cursos
              </button>
            </div>
          </div>
          <img
            className="portada-imagen"
            src="/fotos/velas.jpg"
            alt="Velas de soya hechas a mano"
          />
        </div>
      </section>

      <section className="contenedor seccion">
        <div className="seccion-cabecera">
          <h2>Recién puesto en el mercadito</h2>
          <button className="enlace" onClick={() => onNavegar('mercadito')}>
            Ver todos los productos
          </button>
        </div>
        <div className="cuadricula">
          {destacados.map(producto => (
            <TarjetaProducto
              key={producto.id}
              producto={producto}
              vendedor={buscarPorId(vendedores, producto.vendedorId)}
              onAgregar={onAgregar}
            />
          ))}
        </div>
      </section>

      <section className="contenedor seccion">
        <div className="seccion-cabecera">
          <h2>Cursos de estudiantes</h2>
          <button className="enlace" onClick={() => onNavegar('cursos')}>
            Ver todos los cursos
          </button>
        </div>
        <div className="cuadricula">
          {cursosDestacados.map(curso => (
            <TarjetaCurso
              key={curso.id}
              curso={curso}
              instructor={buscarPorId(vendedores, curso.instructorId)}
              inscrito={inscripciones.includes(curso.id)}
              onInscribirse={onInscribirse}
            />
          ))}
        </div>
      </section>

      <section className="contenedor seccion">
        <h2>Así funciona</h2>
        <div className="pasos">
          {PASOS.map((paso, indice) => (
            <div key={paso.titulo} className="paso">
              <span className="paso-numero">{indice + 1}</span>
              <h3>{paso.titulo}</h3>
              <p>{paso.texto}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Inicio;
