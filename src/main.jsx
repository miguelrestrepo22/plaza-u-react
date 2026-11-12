import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/estilos.css';

// Acá arranca todo: React dibuja la App dentro del <div id="root"> de index.html
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
