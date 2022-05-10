export interface User {
  usuarioId: number;
  rolId: number;
  tipoUsuarioId: number;
  estatusUsuarioId: number;
  personaFisicaId: number;
  usuario: string;
  iniciales: string;
  contrasena: string;
  puesto: string;
  area: string;
  intentos: number;
  fechaAlta: Date;
  fechaUltimoAcceso: Date;
  foto: string
}
