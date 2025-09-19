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
      fechaPartido: form.fechaPartido instanceof Date ? form.fechaPartido.getTime() : null,
      duracionParte: form.duracionParte,
      jugadoresConvocados: convocados,
      estado: form.estado,
      alineaciones: {
        primeraParte: [],
        segundaParte: []
      }
      //creadoEn: Date.now()
      ,
      estadoPrimeraParte: 'esperando',
      estadoSegundaParte: 'esperando'
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

 
iniciarPrimeraParte(partido: Partido): Promise<void> {
  // Cambiamos el estado de la primera parte a "live"
  return this.firebase.modificarPartidoById(partido.id!, { estadoPrimeraParte: 'live', estado: 'live', inicioPrimeraParte: Date.now() });
}
iniciarSegundaParte(partido: Partido): Promise<void> {
  // Cambiamos el estado de la primera parte a "live"
  return this.firebase.modificarPartidoById(partido.id!, { estadoSegundaParte: 'live', estadoPrimeraParte: 'finalizado', estado: 'live' });
}

finalizarPrimeraParte(partido: Partido): Promise<void> {
  return this.firebase.modificarPartidoById(partido.id!, { estadoPrimeraParte: 'descanso', estado: 'descanso' });
}
finalizarSegundaParte(partido: Partido): Promise<void> {
  return this.firebase.modificarPartidoById(partido.id!, { estadoSegundaParte: 'finalizado', estado: 'finalizado' });
}



}
