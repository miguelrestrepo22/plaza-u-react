// Barra de arriba: logo, menú de navegación y botón del carrito.
const ENLACES = [
  { id: 'inicio', texto: 'Inicio' },
  { id: 'mercadito', texto: 'Mercadito' },
  { id: 'cursos', texto: 'Cursos' },
  { id: 'vender', texto: 'Vender' }
];

function Header({ pagina, onNavegar, cantidadCarrito, onAbrirCarrito }) {
  return (
    <header className="encabezado">
      <div className="toldo" aria-hidden="true" />
      <div className="contenedor encabezado-fila">
        <button className="marca" onClick={() => onNavegar('inicio')}>
          <img src="/logo-plaza-u.svg" alt="" width="34" height="34" />
          <span>Plaza U</span>
        </button>

        <nav className="menu" aria-label="Principal">
          {ENLACES.map(enlace => (
            <button
              key={enlace.id}
              className={pagina === enlace.id ? 'activo' : ''}
              aria-current={pagina === enlace.id ? 'page' : undefined}
              onClick={() => onNavegar(enlace.id)}
            >
              {enlace.texto}
            </button>
          ))}
        </nav>

        <button
          className="boton-carrito"
          onClick={onAbrirCarrito}
          aria-label={`Abrir el carrito, ${cantidadCarrito} unidades`}
        >
          Carrito <span className="contador">{cantidadCarrito}</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
