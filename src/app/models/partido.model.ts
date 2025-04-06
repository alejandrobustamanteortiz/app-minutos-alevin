import { Time } from '@angular/common';
import { Jugador } from './jugador.model';

export interface Partido {
  id: string;
  //jugadores?: any;
  //cronometroSegundos: number;
  //parte: 1 | 2;
  duracionParte: number;
  fechaPartido: Date;
  jugadoresConvocados: Jugador[] | null | undefined;
  estado: 'esperando' | 'live' | 'descanso' | 'finalizado';
  rival: string;
  tipoPartido: 'amistoso' | 'liga' | 'torneo';
  jornadaPartido: string;
  //timeStampInicio: number;
}
