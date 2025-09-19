import { Evento } from './evento.model';
import { Formacion } from './formacion.model';
import { Jugador } from './jugador.model';

export interface Partido {
  id: string;
  duracionParte: number; // Duración en minutos de cada parte
  fechaPartido: Date | number; // Mejor si lo guardás como timestamp en Firebase (número)
  jugadoresConvocados: Jugador[]; // Los jugadores seleccionados para este partido
  alineaciones?: {
    primeraParte: Jugador[]
    segundaParte: Jugador[]
  };
  eventos?: Evento

  formacionPrimeraParte?: Formacion
  formacionSegundaParte?: Formacion
  estado: 'sin comenzar' | 'esperando' | 'live' | 'descanso' | 'finalizado'; // Estado del partido
  estadoPrimeraParte?: 'esperando' | 'live' | 'descanso' | 'finalizado'; //Estado primera parte
  estadoSegundaParte?: 'esperando' | 'live' | 'finalizado'; //Estado segunda parte
  rival: string; // Nombre del rival
  tipoPartido: 'amistoso' | 'liga' | 'torneo';
  jornadaPartido: string; // Ej: "Jornada 5", "Playoff 1", etc.
   inicioPrimeraParte?: number;
  finPrimeraParte?: number;

  inicioSegundaParte?: number;
  finSegundaParte?: number;
}
