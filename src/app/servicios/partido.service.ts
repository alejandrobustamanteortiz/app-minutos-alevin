import { Injectable } from '@angular/core';
import { JugadorService } from './jugador.service';
import { FirebaseService } from './firebase/firebase.service';
import { push } from '@angular/fire/database';
import { Partido } from '../models/partido.model';
import { Database, ref, onValue, remove, set } from '@angular/fire/database';
import { map, Observable, timestamp } from 'rxjs';
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


  private mapearPartido(data: any, id: string): Partido {
    return {
      id,
      rival: data.rival,
      estado: data.estado || 'Sin estado',
      jugadoresConvocados: data.jugadoresConvocados || [],
      tipoPartido: data.tipoPartido,
      fechaPartido: data.fechaPartido,
      jornadaPartido: data.jornadaPartido,
      duracionParte: data.duracionParte,
    };
  }
}