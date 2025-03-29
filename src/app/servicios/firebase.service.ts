import { Injectable, inject } from '@angular/core';
import {
  Database,
  ref,
  set,
  get,
  remove,
  push,
  onValue
} from '@angular/fire/database';
import { Partido } from '../models/partido.model';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private db: Database;

  constructor() {
    this.db = inject(Database);
  }

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

  eliminarPartido(id: string) {
    const refPartido = ref(this.db, `partidos/${id}`);
    return remove(refPartido);
  }

  escucharEstadoPartido(id: string, callback: (estado: any) => void): void {
    const partidoRef = ref(this.db, `partidos/${id}`);
    onValue(partidoRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    });
  }

  testConexion() {
    const testRef = ref(this.db, 'testFirebaseWrite');
    return set(testRef, {
      mensaje: '✅ Firebase conectado',
      timestamp: new Date().toISOString()
    });
  }
}
