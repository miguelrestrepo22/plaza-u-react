// Genera docs/API.md a partir de la misma lista de endpoints:  npm run docs
import { mkdirSync, writeFileSync } from 'node:fs';
import { endpoints, grupos } from './endpoints.js';

const etiquetaAuth = {
  publica: 'Pública',
  sesion: 'Con sesión',
  admin: 'Solo administrador'
};
let md = `# Plaza U · API REST

Base: \`http://localhost:3000/api\` · Documentación interactiva: \`http://localhost:3000/api-docs\`

## Cómo usarla

1. Inicia sesión con \`POST /auth/login\` y copia el \`token\` de la respuesta.
2. En las rutas con sesión envía el encabezado \`Authorization: Bearer <token>\`.
3. Todas las respuestas son JSON. Los errores siempre tienen la misma forma:

\`\`\`json
{ "error": { "estado": 400, "mensaje": "Hay datos inválidos en la petición", "detalles": [ { "campo": "precio", "mensaje": "El precio debe ser un entero entre 500 y 10.000.000" } ] } }
\`\`\`

Cuentas de prueba: \`camila@plazau.co\` / \`demo1234\` (estudiante) y \`admin@plazau.co\` / \`admin123\` (administrador).

## Resumen de endpoints

| Método | Ruta | Acceso | Qué hace |
| --- | --- | --- | --- |
${endpoints.map(e => `| ${e.metodo} | \`${e.ruta}\` | ${etiquetaAuth[e.auth]} | ${e.resumen} |`).join('\n')}
`;
for (const grupo of grupos) {
  md += `\n## ${grupo}\n`;
  for (const e of endpoints.filter(x => x.grupo === grupo)) {
    md += `\n### ${e.metodo} \`${e.ruta}\`\n\n${e.resumen}\n\n**Acceso:** ${etiquetaAuth[e.auth]}\n`;
    if (e.query)
      md += `\n**Parámetros de consulta:**\n\n${e.query.map(([n, d]) => `- \`${n}\`: ${d}`).join('\n')}\n`;
    if (e.cuerpo)
      md += `\n**Cuerpo de ejemplo:**\n\n\`\`\`json\n${JSON.stringify(e.cuerpo, null, 2)}\n\`\`\`\n`;
    md += `\n**Respuestas:**\n\n${e.respuestas.map(([c, d]) => `- \`${c}\`: ${d}`).join('\n')}\n`;
  }
}
mkdirSync('../docs', { recursive: true });
writeFileSync('../docs/API.md', md);
console.log('docs/API.md generado con', endpoints.length, 'endpoints');
