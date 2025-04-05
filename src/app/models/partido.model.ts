import { Time } from '@angular/common';
import { Jugador } from './jugador.model';

export interface Partido {
  id: string;
  jugadores?: any;
  cronometroSegundos: number;
  parte: 1 | 2;
  duracionParte: number;
  fechaInicio: Date;
  jugadoresConvocados: Jugador[] | null | undefined; // Permite undefined
  estado: string; // <-- Añade esta propiedad;
  rival: string;
  creadoEn: number | object;
  tipoPartido: string
  jornadaPartido: string
}
