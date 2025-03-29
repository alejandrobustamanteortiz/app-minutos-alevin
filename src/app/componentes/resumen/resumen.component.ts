import { Component } from '@angular/core';
import { JugadorService } from '../../servicios/jugador.service';
import { PartidoService } from '../../servicios/partido.service';
import { Jugador } from '../../models/jugador.model';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.css']
})
export class ResumenComponent {

  constructor(public jugadorService: JugadorService, public partidoService: PartidoService) {}
 

  get jugadores(): Jugador[] {
    return this.jugadorService.getJugadores();
  }

  reiniciar() {
    this.partidoService.reiniciarPartido();
  }
}
