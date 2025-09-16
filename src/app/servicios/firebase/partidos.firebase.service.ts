import { Injectable } from '@angular/core';
import { Database, ref, get, push, set, remove, update } from '@angular/fire/database';
import { Formacion } from 'src/app/models/formacion.model';
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

guardarPrimeraParte(jugadores: Jugador[], partidoId: string): Promise<void> {
  const primeraParteRef = ref(this.db, `partidos/${partidoId}/alineaciones/primeraParte`);
  return set(primeraParteRef, jugadores);

}

guardarSegundaParte(jugadores: Jugador[], partidoId: string): Promise<void> {
  const primeraParteRef = ref(this.db, `partidos/${partidoId}/alineaciones/segundaParte`);
  return set(primeraParteRef, jugadores);

}

guardarFormacionPrimeraParte(formacion : Formacion, partidoId: string): Promise<void> {
  const formacionPrimeraParteRef = ref(this.db, `partidos/${partidoId}/formacionPrimeraParte`);
  return set(formacionPrimeraParteRef, formacion);
}

guardarFormacionSegundaParte(formacion : Formacion, partidoId: string): Promise<void> {
  const formacionPrimeraParteRef = ref(this.db, `partidos/${partidoId}/formacionSegundaParte`);
  return set(formacionPrimeraParteRef, formacion);
}

modificarPartidoById(id: string, datos: Partial<Partido>): Promise<void> {
  const partidoRef = ref(this.db, `partidos/${id}`);
  return update(partidoRef, datos); // Solo actualiza las propiedades que cambian
}

async actualizarJugadoresConvocados(partidoId: string, jugadores: Jugador[]): Promise<void> {
  const partidoRef = ref(this.db, `partidos/${partidoId}/jugadoresConvocados`);
  return set(partidoRef, jugadores);
}






}
