import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Database,
  ref,
  set,
  get,
  off,
  remove,
  push,
  onValue,
} from '@angular/fire/database';
import { Partido } from '../models/partido.model';
import { Jugador } from '../models/jugador.model';
@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private db: Database;

  constructor() {
    this.db = inject(Database);
  }
  //CODIGO NUEVO



  getJugadores(): Observable<Jugador[]> {
    return new Observable((observer) => {
      const jugadoresRef = ref(this.db, 'jugadores');
  
      const unsubscribe = onValue(
        jugadoresRef,
        (snapshot) => {
          const data = snapshot.val();
          const jugadores: Jugador[] = data
            ? Object.entries(data).map(([id, jugador]: any) => ({ id, ...jugador }))
            : [];
          observer.next(jugadores);
        },
        (error) => {
          observer.error(error);
        }
      );
  
      // Cleanup al desuscribirse
      return () => {
        off(jugadoresRef, 'value', unsubscribe);
      };
    });
  }

  getJugadoresOnce(): Promise<Jugador[]> {
    const jugadoresRef = ref(this.db, 'jugadores');
    return get(jugadoresRef).then((snapshot) => {
      const data = snapshot.val();
      if (!data) return [];
      return Object.entries(data).map(([id, jugador]: any) => ({ id, ...jugador }));
    });
  }

  getPartidosOnce(): Promise<Partido[]> {
    const partidosRef = ref(this.db, 'partidos');
  
    return get(partidosRef).then((snapshot) => {
      const data = snapshot.val();
      if (!data) return [];
  
      // Convertimos el objeto recibido en un array de partidos con sus IDs
      return Object.entries(data).map(([id, partido]: any) => ({
        id,
        ...partido,
      }));
    });
  }
  
  agregarJugador(jugador: Omit<Jugador, 'id'>): Promise<Jugador> {
    const jugadoresRef = ref(this.db, 'jugadores');
    const nuevoRef = push(jugadoresRef);
    return set(nuevoRef, jugador).then(() => {
      return { id: nuevoRef.key!, ...jugador }; // ← devolvemos el nuevo jugador con su ID
    });
  }

  eliminarJugador(id: string): Promise<void> {
    const jugadorRef = ref(this.db, `jugadores/${id}`);
    return remove(jugadorRef);
  }

  
  eliminarPartido(id: string): Promise<void> {
    const partidosRef = ref(this.db, `partidos/${id}`);
    return remove(partidosRef);
  }

  guardarPartido(partido: Partido): Promise<void> {
    const partidosRef = ref(this.db, 'partidos');
    const nuevoRef = push(partidosRef);
    return set(nuevoRef, partido);
  }














































  //---------------------------------------------------------------SPAGUETI

  guardarEstadoPartido(id: string, estado: any) {
    const partidoRef = ref(this.db, `partidos/${id}`);
    return set(partidoRef, estado);
  }

  obtenerEstadoPartido(id: string) {
    const partidoRef = ref(this.db, `partidos/${id}`);
    return get(partidoRef);
  }

  guardarHistorialPartido(partido: Partido) {
    const historialRef = ref(this.db, 'historial');
    const nuevoRef = push(historialRef);
    return set(nuevoRef, partido);
  }

  escucharEstadoPartido(id: string, callback: (estado: any) => void): void {
    const partidoRef = ref(this.db, `partidos/${id}`);
    onValue(partidoRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    });
  }
  obtenerHistorialPartidos(): Promise<Partido[]> {
    const historialRef = ref(this.db, 'partidos');
    console.log('el historial es:' + historialRef);
    return get(historialRef).then((snapshot) => {
      const data = snapshot.val();
      if (!data) return [];

      return Object.entries(data).map(([id, partido]: any) => ({
        id,
        ...partido,
      }));
    });
  }

  testConexion() {
    const testRef = ref(this.db, 'testFirebaseWrite');
    return set(testRef, {
      mensaje: '✅ Firebase conectado',
      timestamp: new Date().toISOString(),
    });
  }

  // Método genérico para leer datos en tiempo real
  obtenerRealtime(path: string): Observable<any> {
    return new Observable((observer) => {
      const dbRef = ref(this.db, path);

      const unsubscribe = onValue(
        dbRef,
        (snapshot) => {
          observer.next(snapshot.val());
        },
        (error) => {
          observer.error(error);
        }
      );

      // Limpieza al desuscribirse
      return () => off(dbRef, 'value', unsubscribe);
    });
  }
}
