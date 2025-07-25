import { Injectable } from '@angular/core';
import { Database, ref, get, push, set, remove } from '@angular/fire/database';
import { Jugador } from 'src/app/models/jugador.model';
import { Partido } from 'src/app/models/partido.model';

@Injectable({ providedIn: 'root' })
export class PartidosFirebaseService {
  constructor(private db: Database) {}

  /**
   * Obtiene un partido desde Firebase una sola vez, dado su ID.
   * @param id ID del partido
   * @returns Partido completo con ID incluido
   */
  getPartidoByIdOnce(id: string): Promise<Partido> {
    const partidoRef = ref(this.db, `partidos/${id}`);
    return get(partidoRef).then(snapshot => {
      const data = snapshot.val();
      if (!data) throw new Error(`No se encontró el partido con ID: ${id}`);
      return { id, ...data };
    });
  }

  /**
   * Obtiene todos los partidos almacenados en Firebase una sola vez.
   * Esta función no escucha en tiempo real.
   * @returns Una promesa que resuelve con un array de partidos con su ID incluido
   */
  getAllPartidosOnce(): Promise<Partido[]> {
    const partidosRef = ref(this.db, 'partidos');

    return get(partidosRef).then(snapshot => {
      const data = snapshot.val();
      if (!data) return [];

      return Object.entries(data).map(([id, partido]: any) => ({
        id,
        ...partido
      }));
    });
  }

  /**
   * Guarda un nuevo partido en Firebase y devuelve su ID generado.
   * @param partido Objeto de partido sin ID (el ID lo genera Firebase con push)
   * @returns Una promesa que resuelve con el ID generado del partido
   */
  guardarPartido(partido: Omit<Partido, 'id'>): Promise<string> {
    const partidosRef = ref(this.db, 'partidos');
    const nuevoRef = push(partidosRef);

    return set(nuevoRef, partido).then(() => nuevoRef.key!);
  }

  /**
 * Elimina un partido de Firebase dado su ID.
 * @param id ID del partido a eliminar
 * @returns Promesa que resuelve cuando el partido ha sido eliminado
 */
eliminarPartido(id: string): Promise<void> {
  const partidoRef = ref(this.db, `partidos/${id}`);
  return remove(partidoRef);
}

guardarPrimeraParte(jugadores: string[], partidoId: string): Promise<void> {
  console.log('hello world')
  const primeraParteRef = ref(this.db, `partidos/${partidoId}/alineaciones/primeraParte`);
  return set(primeraParteRef, jugadores);

}}
