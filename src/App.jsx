import { useEffect, useState } from 'react';
import Aviso from './components/Aviso.jsx';
import Carrito from './components/Carrito.jsx';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import { cursosIniciales } from './data/cursos.js';
import { productosIniciales } from './data/productos.js';
import { vendedores } from './data/vendedores.js';
import Cursos from './pages/Cursos.jsx';
import Inicio from './pages/Inicio.jsx';
import Mercadito from './pages/Mercadito.jsx';
import Vender from './pages/Vender.jsx';
import { buscarPorId } from './utils/buscar.js';

// Componente raíz. Acá vive todo el estado de la app y se reparte a las páginas por props.
function App() {
  const [pagina, setPagina] = useState('inicio'); // qué sección se ve
  const [productos, setProductos] = useState(productosIniciales); // catálogo (arreglo de objetos)
  const [cursos, setCursos] = useState(cursosIniciales); // cursos con sus cupos
  const [carrito, setCarrito] = useState([]); // líneas: { id, cantidad }
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [inscripciones, setInscripciones] = useState([]); // ids de los cursos tomados
  const [aviso, setAviso] = useState('');

  // Con la tecla Escape se cierra el carrito
  useEffect(() => {
    function alPulsarTecla(evento) {
      if (evento.key === 'Escape') setCarritoAbierto(false);
    }
    document.addEventListener('keydown', alPulsarTecla);
    return () => document.removeEventListener('keydown', alPulsarTecla);
  }, []);

  function mostrarAviso(texto) {
    setAviso(texto);
    setTimeout(() => setAviso(''), 2600);
  }

  function navegar(destino) {
    setPagina(destino);
    window.scrollTo(0, 0);
  }

  // ---------- Carrito ----------
  function agregarAlCarrito(id) {
    const producto = buscarPorId(productos, id);
    const linea = carrito.find(l => l.id === id);
    const enCarrito = linea ? linea.cantidad : 0;

    if (enCarrito + 1 > producto.stock) {
      mostrarAviso(`Solo quedan ${producto.stock} unidades de este producto.`);
      return;
    }
    if (linea) {
      setCarrito(carrito.map(l => (l.id === id ? { ...l, cantidad: l.cantidad + 1 } : l)));
    } else {
      setCarrito([...carrito, { id, cantidad: 1 }]);
    }
    mostrarAviso('Agregado al carrito.');
  }

  function cambiarCantidad(id, cambio) {
    const producto = buscarPorId(productos, id);
    const linea = carrito.find(l => l.id === id);
    if (cambio > 0 && linea.cantidad + cambio > producto.stock) {
      mostrarAviso(`Solo quedan ${producto.stock} unidades de este producto.`);
      return;
    }
    // Se actualiza la cantidad y se quitan las líneas que quedan en cero
    setCarrito(
      carrito
        .map(l => (l.id === id ? { ...l, cantidad: l.cantidad + cambio } : l))
        .filter(l => l.cantidad > 0)
    );
  }

  function quitarDelCarrito(id) {
    setCarrito(carrito.filter(l => l.id !== id));
  }

  // Simula la compra: descuenta el stock de cada producto y vacía el carrito
  function finalizarPedido() {
    setProductos(
      productos.map(p => {
        const linea = carrito.find(l => l.id === p.id);
        return linea ? { ...p, stock: p.stock - linea.cantidad } : p;
      })
    );
    setCarrito([]);
    setCarritoAbierto(false);
    mostrarAviso('Pedido enviado (simulado). El vendedor te contactará.');
  }

  // Une cada línea del carrito con los datos de su producto, para mostrarla
  const itemsCarrito = carrito.map(linea => ({
    ...buscarPorId(productos, linea.id),
    cantidad: linea.cantidad
  }));
  const cantidadCarrito = carrito.reduce((suma, linea) => suma + linea.cantidad, 0);

  // ---------- Cursos ----------
  function inscribirse(id) {
    const curso = buscarPorId(cursos, id);
    if (inscripciones.includes(id)) return;
    if (curso.cupos < 1) {
      mostrarAviso('Este curso ya no tiene cupos.');
      return;
    }
    setCursos(cursos.map(c => (c.id === id ? { ...c, cupos: c.cupos - 1 } : c)));
    setInscripciones([...inscripciones, id]);
    mostrarAviso(`Te inscribiste a «${curso.titulo}».`);
  }

  // ---------- Productos del usuario ----------
  function publicarProducto(datos) {
    const nuevo = {
      ...datos,
      id: `p${Date.now()}`,
      foto: '/fotos/suculentas.jpg', // en esta versión todos los productos nuevos usan una foto de ejemplo
      vendedorId: 'yo'
    };
    setProductos([nuevo, ...productos]); // el nuevo va primero
    mostrarAviso('Producto publicado. Ya aparece en el mercadito.');
  }

  function eliminarProducto(id) {
    setProductos(productos.filter(p => p.id !== id));
    setCarrito(carrito.filter(l => l.id !== id));
  }

  const misProductos = productos.filter(p => p.vendedorId === 'yo');

  return (
    <>
      <Header
        pagina={pagina}
        onNavegar={navegar}
        cantidadCarrito={cantidadCarrito}
        onAbrirCarrito={() => setCarritoAbierto(true)}
      />

      <main>
        {pagina === 'inicio' && (
          <Inicio
            productos={productos}
            cursos={cursos}
            vendedores={vendedores}
            inscripciones={inscripciones}
            onNavegar={navegar}
            onAgregar={agregarAlCarrito}
            onInscribirse={inscribirse}
          />
        )}
        {pagina === 'mercadito' && (
          <Mercadito productos={productos} vendedores={vendedores} onAgregar={agregarAlCarrito} />
        )}
        {pagina === 'cursos' && (
          <Cursos
            cursos={cursos}
            instructores={vendedores}
            inscripciones={inscripciones}
            onInscribirse={inscribirse}
          />
        )}
        {pagina === 'vender' && (
          <Vender
            misProductos={misProductos}
            onPublicar={publicarProducto}
            onEliminar={eliminarProducto}
          />
        )}
      </main>

      <Footer />

      <Carrito
        abierto={carritoAbierto}
        items={itemsCarrito}
        onCerrar={() => setCarritoAbierto(false)}
        onCambiarCantidad={cambiarCantidad}
        onQuitar={quitarDelCarrito}
        onFinalizar={finalizarPedido}
      />
      <Aviso texto={aviso} />
    </>
  );
}

export default App;
