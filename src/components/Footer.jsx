// Pie de página con el eslogan y los datos del proyecto.
function Footer() {
  return (
    <footer className="pie">
      <div className="contenedor pie-fila">
        <div>
          <strong className="pie-marca">Plaza U</strong>
          <p>El mercadito y la escuela de los estudiantes.</p>
        </div>
        <p className="pie-nota">
          Primer entregable de React · Datos de ejemplo, sin base de datos.
          <br />
          Tecnológico de Antioquia · 2026
        </p>
      </div>
    </footer>
  );
}

export default Footer;
