// Pie de página con el eslogan y de dónde vienen los datos (la API o los datos de ejemplo).
function Footer({ origen }) {
  return (
    <footer className="pie">
      <div className="contenedor pie-fila">
        <div>
          <strong className="pie-marca">Plaza U</strong>
          <p>El mercadito y la escuela de los estudiantes.</p>
        </div>
        <p className="pie-nota">
          {origen === 'api'
            ? 'Datos desde la API (Express + PostgreSQL).'
            : 'API apagada: se muestran datos de ejemplo.'}
          <br />
          Tecnológico de Antioquia · 2026
        </p>
      </div>
    </footer>
  );
}

export default Footer;
