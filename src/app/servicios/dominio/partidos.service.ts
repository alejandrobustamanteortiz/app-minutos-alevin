import { Injectable } from '@angular/core';
import { PartidosFirebaseService } from '../firebase/partidos.firebase.service';
import { Jugador } from 'src/app/models/jugador.model';
import { Partido } from 'src/app/models/partido.model';

@Injectable({
  providedIn: 'root',
})
export class PartidosService {
  constructor(private firebase: PartidosFirebaseService) {}

  crearPartidoDesdeFormulario(
    form: any,
    jugadoresDisponibles: Jugador[],
    idsSeleccionados: string[]
  ): Promise<string> {
    const convocados = jugadoresDisponibles.filter((j) =>
      idsSeleccionados.includes(j.id!)
    );

    const partido: Omit<Partido, 'id'> = {
      tipoPartido: form.tipoPartido,
      jornadaPartido: form.jornadaPartido || '',
      rival: form.rival,
      fechaPartido:
        form.fechaPartido instanceof Date ? form.fechaPartido.getTime() : null,
      duracionParte: form.duracionParte,
      jugadoresConvocados: convocados,
      estado: 'esperando',
      //creadoEn: Date.now()
    };

    return this.firebase.guardarPartido(partido);
  }

  /**
   * Devuelve todos los partidos disponibles en Firebase (una sola vez).
   */
  obtenerTodosLosPartidos(): Promise<Partido[]> {
    return this.firebase.getAllPartidosOnce();
  }

  obtenerPartidoById(id: string): Promise<Partido> {
    return this.firebase.getPartidoByIdOnce(id);
  }

  eliminarPartido(id: string): Promise<void> {
    return this.firebase.eliminarPartido(id);
  }
}
