import { Component } from '@angular/core';
import { JugadorService } from '../../servicios/jugador.service';
import { Jugador } from '../../models/jugador.model';

@Component({
  selector: 'app-partido',
  templateUrl: './partido.component.html',
  styleUrls: ['./partido.component.css']
})
export class PartidoComponent {
  constructor(public jugadorService: JugadorService) {}

  get jugadores(): Jugador[] {
    return this.jugadorService.getJugadores();
  }

  get titulares(): Jugador[] {
    return this.jugadorService.getJugadores().filter(j => j.enCampo);
  }
  
  get suplentes(): Jugador[] {
    return this.jugadorService.getJugadores().filter(j => !j.enCampo);
  }
  

  iniciarPartido() {
    this.jugadorService.iniciarPartido();
  }

  pausarPartido() {
    this.jugadorService.pausarPartido();
  }

  reiniciarPartido() {
    this.jugadorService.reiniciarPartidoCompleto();
  }
  alternarCampo(id: number) {
    this.jugadorService.alternarCampo(id);
  }
  
}
