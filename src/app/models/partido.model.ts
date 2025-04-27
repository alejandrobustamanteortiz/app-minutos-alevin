import { Jugador } from './jugador.model';

export interface Partido {
  id: string;

  duracionParte: number; // Duración en minutos de cada parte
  fechaPartido: Date | number; // Mejor si lo guardás como timestamp en Firebase (número)

  jugadoresConvocados: Jugador[]; // Los jugadores seleccionados para este partido

  alineaciones?: {
    primeraParte: string[]; // IDs de titulares en 1ª parte
    segundaParte: string[]; // IDs de titulares en 2ª parte
  };

  estado: 'esperando' | 'live' | 'descanso' | 'finalizado'; // Estado del partido

  rival: string; // Nombre del rival
  tipoPartido: 'amistoso' | 'liga' | 'torneo';
  jornadaPartido: string; // Ej: "Jornada 5", "Playoff 1", etc.
}
