import { Injectable } from '@angular/core';
import { JugadoresFirebaseService } from '../firebase/jugadores.firebase.service';
import { Jugador } from 'src/app/models/jugador.model';

@Injectable({ providedIn: 'root' })
export class JugadoresService {
  constructor(private firebase: JugadoresFirebaseService) {}

  /**
   * Obtiene todos los jugadores de la plantilla (una sola vez).
   */
  obtenerJugadores(): Promise<Jugador[]> {
    return this.firebase.getAllJugadoresOnce();
  }

  /**
   * Agrega un nuevo jugador a la base de datos.
   * @param jugador Jugador sin ID
   * @returns El jugador agregado con su ID asignado
   */
  crearJugador(jugador: Omit<Jugador, 'id'>): Promise<Jugador> {
    return this.firebase.agregarJugador(jugador);
  }

  /**
   * Elimina un jugador por su ID.
   */
  eliminarJugador(id: string): Promise<void> {
    return this.firebase.eliminarJugador(id);
  }
}
