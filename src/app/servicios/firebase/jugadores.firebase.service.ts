import { Injectable } from '@angular/core';
import { Database, ref, get, push, set, remove } from '@angular/fire/database';
import { Jugador } from 'src/app/models/jugador.model';

@Injectable({ providedIn: 'root' })
export class JugadoresFirebaseService {
  constructor(private db: Database) {}

  /**
   * Obtiene todos los jugadores desde Firebase una sola vez.
   * Ideal para mostrar la plantilla actual en el formulario de partido.
   */
  getAllJugadoresOnce(): Promise<Jugador[]> {
    const jugadoresRef = ref(this.db, 'jugadores');

    return get(jugadoresRef).then(snapshot => {
      const data = snapshot.val();
      if (!data) return [];

      return Object.entries(data).map(([id, jugador]: any) => ({
        id,
        ...jugador
      }));
    });
  }

  /**
   * Agrega un nuevo jugador a Firebase.
   * @param jugador Jugador sin ID (el ID lo genera Firebase)
   * @returns El jugador guardado con su ID asignado
   */
  agregarJugador(jugador: Omit<Jugador, 'id'>): Promise<Jugador> {
    const jugadoresRef = ref(this.db, 'jugadores');
    const nuevoRef = push(jugadoresRef);

    return set(nuevoRef, jugador).then(() => ({
      id: nuevoRef.key!,
      ...jugador
    }));
  }

  /**
   * Elimina un jugador por su ID.
   * @param id ID del jugador a eliminar
   */
  eliminarJugador(id: string): Promise<void> {
    const jugadorRef = ref(this.db, `jugadores/${id}`);
    return remove(jugadorRef);
  }
}
