// Mensajito de abajo ("Agregado al carrito", "Te inscribiste"...). Desaparece solo desde App.jsx.
function Aviso({ texto }) {
  if (!texto) return null;
  return (
    <div className="aviso" role="status">
      {texto}
    </div>
  );
}

export default Aviso;
