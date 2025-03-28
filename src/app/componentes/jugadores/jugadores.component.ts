import { Component } from '@angular/core';
import { JugadorService } from '../../servicios/jugador.service';
import { Jugador } from '../../models/jugador.model';

@Component({
  selector: 'app-jugadores',
  templateUrl: './jugadores.component.html',
  styleUrls: ['./jugadores.component.css']
})
export class JugadoresComponent {
  nuevoNombre = '';
  nuevoDorsal: number | null = null;

  constructor(public jugadorService: JugadorService) {}

  get jugadores(): Jugador[] {
    return this.jugadorService.getJugadores();
  }

  agregarJugador() {
    if (this.nuevoNombre && this.nuevoDorsal !== null) {
      this.jugadorService.agregarJugador(this.nuevoNombre, this.nuevoDorsal);
      this.nuevoNombre = '';
      this.nuevoDorsal = null;
    }
  }

  alternarCampo(jugador: Jugador) {
    this.jugadorService.alternarCampo(jugador.id);
  }
}
