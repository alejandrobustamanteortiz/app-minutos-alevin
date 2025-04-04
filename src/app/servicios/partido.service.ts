import { Injectable } from '@angular/core';
import { JugadorService } from './jugador.service';
import { FirebaseService } from './firebase.service';
import { push } from '@angular/fire/database';
import { Partido } from '../models/partido.model';
import { Database, ref, onValue, remove, set } from '@angular/fire/database';
import { map, Observable } from 'rxjs';
import { serverTimestamp } from 'firebase/database';

@Injectable({
  providedIn: 'root',
})
export class PartidoService {
  private partidoId = 'partidoActual';
  private parteActual: 1 | 2 = 1;
  private cronometroSegundos = 0;
  private fechaInicio: number | null = null;
  partidoEnCurso = false;
  private cronometroInterval: any;
  private sumaMinutosInterval: any;
  cronometroDisplay: string = '00:00';
  primeraParteFinalizada: boolean = false;
  segundaParteFinalizada: boolean = false;

  constructor(
    private db: Database,
    private jugadorService: JugadorService,
    private firebaseService: FirebaseService
  ) {

  }

  // 🔍 1. Obtener partidos en tiempo real
  obtenerPartidos(): Observable<any[]> {
    return new Observable((observer) => {
      const partidosRef = ref(this.db, 'partidos');

      onValue(partidosRef, (snapshot) => {
        const data = snapshot.val();

        // Transformamos el objeto en array con ID incluido
        const listaPartidos = Object.entries(data || {}).map(
          ([id, partido]: [string, any]) => ({
            id,
            ...partido,
          })
        );

        observer.next(listaPartidos);
      });
    });
  }

  crearPartido(partido: Partido): Promise<void> {
    return this.firebaseService.guardarPartido(partido);
  }

 



  // Obtener un partido específico
  obtenerPartido(id: string): Observable<Partido> {
    return this.firebaseService.obtenerRealtime(`partidos/${id}`).pipe(
      map(data => {
        if (!data) throw new Error('Partido no encontrado');
        return this.mapearPartido(data, id);
      })
    );
  }

  private mapearPartido(data: any, id: string): Partido {
    return {
      id,
      rival: data.rival,
      //fechaInicio: data.fechaInicio ? new Date(data.fechaInicio) : null,
      creadoEn: data.creadoEn,
      estado: data.estado || 'pendiente',
      jugadoresConvocados: data.jugadoresConvocados || [],
      cronometroSegundos: data.cronometroSegundos,
      parte: data.parte,
      duracionParte: data.duracionParte

      // ... otros campos
    };
  }

  eliminarPartido(id: string): Promise<void> {
    console.log('🧪 Eliminando partido con ID:', id);
    return this.firebaseService.eliminarPartido(id);
  }
}
