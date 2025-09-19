import { Jugador } from "./jugador.model";

export interface Sustitucion {
  minuto: number;
  entraCampo: Jugador
  saleCampo: Jugador
  partidoId: string 
}
