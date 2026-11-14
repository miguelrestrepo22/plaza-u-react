import { COMISION_MAXIMA, COMISION_POR_DEFECTO } from '../config/constantes.js';
import { consultar } from '../config/db.js';
import * as Config from '../models/config.model.js';

// Porcentaje de comisión que cobra Plaza U. El administrador lo puede cambiar (0 a 20).
export async function comisionActual(db = consultar) {
  const valor = await Config.obtener('comision_porcentaje', db);
  return valor === undefined ? COMISION_POR_DEFECTO : Number(valor);
}

export async function obtener() {
  return {
    comisionPorcentaje: await comisionActual(),
    comisionMaxima: COMISION_MAXIMA
  };
}

export async function actualizar({ comisionPorcentaje }) {
  await Config.guardar('comision_porcentaje', comisionPorcentaje);
  return obtener();
}
