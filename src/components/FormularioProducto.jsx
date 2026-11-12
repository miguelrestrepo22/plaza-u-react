import { useState } from 'react';
import { CATEGORIAS } from '../data/categorias.js';

const VACIO = { nombre: '', categoria: CATEGORIAS[0], precio: '', stock: '', descripcion: '' };

// Formulario para publicar un producto. Cada campo es "controlado": su valor está en el estado.
function FormularioProducto({ onPublicar }) {
  const [datos, setDatos] = useState(VACIO);
  const [errores, setErrores] = useState({});

  // Un solo manejador para todos los campos: usa el atributo name del input
  function manejarCambio(evento) {
    const { name, value } = evento.target;
    setDatos({ ...datos, [name]: value });
  }

  // Devuelve un objeto con los mensajes de error; si está vacío, todo está bien
  function validar() {
    const nuevos = {};
    if (datos.nombre.trim().length < 3) nuevos.nombre = 'Escribe el nombre (mínimo 3 letras).';
    if (!(Number(datos.precio) >= 500)) nuevos.precio = 'El precio mínimo es $500.';
    if (!(Number(datos.stock) >= 0) || datos.stock === '')
      nuevos.stock = 'Escribe las unidades (0 o más).';
    if (datos.descripcion.trim().length < 10)
      nuevos.descripcion = 'Describe el producto (mínimo 10 letras).';
    return nuevos;
  }

  function manejarEnvio(evento) {
    evento.preventDefault();
    const nuevos = validar();
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    onPublicar({
      nombre: datos.nombre.trim(),
      categoria: datos.categoria,
      precio: Number(datos.precio),
      stock: Number(datos.stock),
      descripcion: datos.descripcion.trim()
    });
    setDatos(VACIO);
  }

  return (
    <form className="formulario" onSubmit={manejarEnvio} noValidate>
      <div className="campo">
        <label htmlFor="nombre">Nombre del producto</label>
        <input
          id="nombre"
          name="nombre"
          value={datos.nombre}
          onChange={manejarCambio}
          maxLength="120"
        />
        {errores.nombre && <p className="error">{errores.nombre}</p>}
      </div>

      <div className="campo">
        <label htmlFor="categoria">Categoría</label>
        <select id="categoria" name="categoria" value={datos.categoria} onChange={manejarCambio}>
          {CATEGORIAS.map(categoria => (
            <option key={categoria}>{categoria}</option>
          ))}
        </select>
      </div>

      <div className="fila-doble">
        <div className="campo">
          <label htmlFor="precio">Precio (COP)</label>
          <input
            id="precio"
            name="precio"
            type="number"
            min="0"
            value={datos.precio}
            onChange={manejarCambio}
          />
          {errores.precio && <p className="error">{errores.precio}</p>}
        </div>
        <div className="campo">
          <label htmlFor="stock">Unidades disponibles</label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            value={datos.stock}
            onChange={manejarCambio}
          />
          {errores.stock && <p className="error">{errores.stock}</p>}
        </div>
      </div>

      <div className="campo">
        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          name="descripcion"
          rows="3"
          value={datos.descripcion}
          onChange={manejarCambio}
        />
        {errores.descripcion && <p className="error">{errores.descripcion}</p>}
      </div>

      <button type="submit" className="boton boton-barro">
        Publicar producto
      </button>
    </form>
  );
}

export default FormularioProducto;
