import { Component } from '@angular/core';
import { JugadorService } from '../../servicios/jugador.service';
import { Jugador } from '../../models/jugador.model';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.css']
})
export class ResumenComponent {
  constructor(public jugadorService: JugadorService) {}

  get jugadores(): Jugador[] {
    return this.jugadorService.getJugadores();
  }

  reiniciar() {
    this.jugadorService.reiniciarPartido();
  }
}
