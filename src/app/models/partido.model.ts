import { Jugador } from './jugador.model';

export interface Partido {
  id: string;
  jugadores: Jugador[];
  cronometroSegundos: number;
  fechaInicio: number | null;
  partidoEnCurso: boolean;
  parte: 1 | 2;
  primeraParteFinalizada: boolean;
  segundaParteFinalizada: boolean;
}
