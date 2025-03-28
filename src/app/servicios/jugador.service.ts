import { Injectable } from '@angular/core';
import { Jugador } from '../models/jugador.model';

@Injectable({
  providedIn: 'root'
})
export class JugadorService {
  private jugadores: Jugador[] = [];
  private siguienteId = 1;

  constructor() { }

  getJugadores(): Jugador[] {
    return this.jugadores;
  }

  agregarJugador(nombre: string, dorsal: number) {
    this.jugadores.push({
      id: this.siguienteId++,
      nombre,
      dorsal,
      enCampo: false,
      minutosJugados: 0
    });
  }

  alternarCampo(jugadorId: number) {
    const jugador = this.jugadores.find(j => j.id === jugadorId);
    if (jugador) {
      jugador.enCampo = !jugador.enCampo;
    }
  }

  sumarMinutoAJugadoresEnCampo() {
    this.jugadores.forEach(j => {
      if (j.enCampo) {
        j.minutosJugados++;
      }
    });
  }

  reiniciarPartido() {
    this.jugadores.forEach(j => {
      j.enCampo = false;
      j.minutosJugados = 0;
    });
  }
}
