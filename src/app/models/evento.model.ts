import { Gol } from "./gol.model";
import { Sustitucion } from "./sustitucion.model";
import { Tiempos } from "./tiempos.model";

export interface Evento {
goles: Gol[];
sustituciones: Sustitucion[];
tiempos: Tiempos;

}
