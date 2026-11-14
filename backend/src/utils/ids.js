import { randomUUID } from 'node:crypto';

// Ids cortos y legibles con un prefijo que dice de qué es cada uno: p_3f9a1c2b (producto), c_ (curso)...
export const nuevoId = prefijo => `${prefijo}_${randomUUID().slice(0, 8)}`;
