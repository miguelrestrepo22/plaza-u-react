# Plaza U · Primer entregable (React)

Plaza U es el mercadito y la escuela de los estudiantes: un sitio donde se **comercializan productos hechos por estudiantes** y se **ofrecen cursos presenciales** dentro de la universidad.

Este repositorio es el **primer entregable** de Construcción de Software III: la implementación inicial del frontend con JavaScript y React. Los datos son de ejemplo (arreglos en `src/data`), no hay base de datos ni servidor.

**Integrantes:** Miguel Angel Restrepo Pineda y Lucas Lobo Lopez · Tecnológico de Antioquia · 2026

## Qué se puede hacer

- **Inicio:** portada, los productos más nuevos, cursos destacados y cómo funciona.
- **Mercadito:** buscar (sin importar tildes ni mayúsculas), filtrar por categoría y ordenar por precio.
- **Carrito:** agregar, subir o bajar la cantidad, quitar, ver el total y finalizar el pedido (simulado, descuenta el stock).
- **Cursos:** buscar, filtrar por nivel e inscribirse (baja el cupo y se ve en «Mis inscripciones»).
- **Vender:** formulario con validación para publicar un producto, que aparece en el mercadito, y botón para eliminarlo.

## Cómo ejecutarlo

Necesitas [Node.js](https://nodejs.org) 18 o superior.

```bash
npm install     # instala las dependencias
npm run dev     # abre la app en http://localhost:5173
```

Otros comandos:

```bash
npm run build   # genera la versión de producción en dist/
npm run lint    # revisa el código con ESLint
npm run format  # da formato con Prettier
```

## Estructura del proyecto

```
index.html           página base
public/              logo y fotos de ejemplo
src/
  main.jsx           arranca React
  App.jsx            componente raíz: guarda el estado y lo reparte por props
  data/              datos simulados: productos, cursos, vendedores, categorías
  pages/             una pantalla por archivo: Inicio, Mercadito, Cursos, Vender
  components/        piezas reutilizables: Header, Footer, TarjetaProducto, TarjetaCurso,
                     Chips, Buscador, Carrito, FormularioProducto, EstadoVacio, Aviso
  utils/             funciones sueltas: formato de pesos, búsqueda por id
  styles/            estilos.css con la paleta de colores
docs/                documento del entregable y capturas del sistema funcionando
```

## Dónde se cumple cada requisito

| Requisito del entregable | Dónde está |
| --- | --- |
| Proyecto con React y Vite | `package.json`, `vite.config.js`, `src/main.jsx` |
| Estructura organizada de carpetas y componentes | carpetas `pages`, `components`, `data`, `utils`, `styles` |
| Componentes reutilizables | `TarjetaProducto` (inicio y mercadito), `TarjetaCurso` (inicio y cursos), `Chips` (categorías y niveles), `Buscador`, `EstadoVacio` |
| `useState` | `App.jsx` (página, productos, cursos, carrito, inscripciones, aviso); `Mercadito.jsx` y `Cursos.jsx` (filtros); `FormularioProducto.jsx` (campos y errores) |
| Listas con `map()` | `Mercadito.jsx`, `Cursos.jsx`, `Inicio.jsx`, `Header.jsx`, `Chips.jsx`, `Carrito.jsx`, `Vender.jsx` |
| Eventos | `onClick` (agregar, quitar, inscribirse, navegar), `onChange` (buscador, select, formulario), `onSubmit` (publicar), tecla Escape en `App.jsx` |
| Datos simulados en arreglos | `src/data/*.js` |
| Documento con problema y requisitos | `docs/Primer-entregable-PlazaU.docx` (y su versión en PDF) |

## Subirlo a GitHub

1. Crea un repositorio vacío en [github.com/new](https://github.com/new) (por ejemplo `plaza-u-react`), sin README ni .gitignore.
2. En la carpeta del proyecto:

```bash
git init
git add .
git commit -m "Primer entregable: Plaza U con React"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/plaza-u-react.git
git push -u origin main
```

3. Agrega a Lucas como colaborador: **Settings → Collaborators → Add people**.

## Siguientes pasos

Esta versión no guarda nada: al recargar la página los datos vuelven a su estado inicial. La versión completa del proyecto conecta la interfaz con una API y una base de datos, con registro de usuarios, pedidos reales y comisiones.
