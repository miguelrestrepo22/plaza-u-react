# Plaza U · Frontend (React)

Interfaz de Plaza U hecha con **React 18** y **Vite**. Muestra el mercadito y los cursos, con carrito, inscripciones y un formulario para publicar productos.

## Conexión con el backend

Al abrir la app pide a la API (`/api/productos`, `/api/cursos` y `/api/vendedores`). Vite redirige `/api` hacia `http://localhost:3000` (ver `vite.config.js`), así que primero hay que encender el backend (carpeta `../backend`).

Si el backend está apagado, la app **sigue funcionando con los datos de ejemplo** de `src/data`, y el pie de página lo avisa.

## Cómo ejecutarlo

```bash
npm install
npm run dev     # http://localhost:5173
```

```bash
npm run build   # versión de producción en dist/
npm run lint    # revisa el código con ESLint
npm run format  # da formato con Prettier
```

## Estructura

```
src/
  main.jsx           arranca React
  App.jsx            componente raíz: estado global y conexión con la API
  data/              datos de ejemplo (respaldo cuando la API está apagada)
  pages/             Inicio, Mercadito, Cursos, Vender
  components/        piezas reutilizables
  services/api.js    llamadas a la API
  utils/             formato de pesos, búsqueda por id
  styles/            estilos.css con la paleta
```

En esta versión el carrito, las inscripciones y la publicación de productos todavía se manejan en el navegador; el siguiente paso es enviarlos a la API (con inicio de sesión).
