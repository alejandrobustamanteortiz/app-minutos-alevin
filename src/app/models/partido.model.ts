import { Jugador } from './jugador.model';

export interface Partido {
  id: string;
  duracionParte: number; // Duración en minutos de cada parte
  fechaPartido: Date | number; // Mejor si lo guardás como timestamp en Firebase (número)
  jugadoresConvocados: Jugador[]; // Los jugadores seleccionados para este partido
  alineaciones?: {
    primeraParteTitulares: string[]; // IDs de titulares en 1ª parte
    segundaParteTitulares: string[]; // IDs de titulares en 2ª parte
    primeraParteSuplentes: string[];
    segundaParteSuplentes: string[];
  };
  estado: 'esperando' | 'live' | 'descanso' | 'finalizado'; // Estado del partido
  rival: string; // Nombre del rival
  tipoPartido: 'amistoso' | 'liga' | 'torneo';
  jornadaPartido: string; // Ej: "Jornada 5", "Playoff 1", etc.
}
