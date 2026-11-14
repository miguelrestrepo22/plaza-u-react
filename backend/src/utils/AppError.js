// Error "esperado" de la aplicación: lleva el código HTTP que se debe responder.
// Los servicios lo lanzan y el middleware errorHandler lo convierte en respuesta.
export class AppError extends Error {
  constructor(estado, mensaje, detalles) {
    super(mensaje);
    this.estado = estado;
    this.detalles = detalles;
  }
}

export const noEncontrado = recurso => new AppError(404, `${recurso} no encontrado`);
