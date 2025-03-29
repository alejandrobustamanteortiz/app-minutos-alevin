import { Component } from '@angular/core';
import { Jugador } from '../../models/jugador.model';
import { JugadorService } from '../../servicios/jugador.service';
import { PartidoService } from '../../servicios/partido.service';



@Component({
  selector: 'app-partido',
  templateUrl: './partido.component.html',
  styleUrls: ['./partido.component.css']
})
export class PartidoComponent {

  constructor(
    public jugadorService: JugadorService,
    public partidoService: PartidoService
  ) {}

  nombreRival: string = '';

  get jugadores(): Jugador[] {
    return this.jugadorService.getJugadores();
  }

  get titulares(): Jugador[] {
    return this.jugadores.filter(j => j.enCampo);
  }

  get suplentes(): Jugador[] {
    return this.jugadores.filter(j => !j.enCampo);
  }

  get cronometro(): string {
    return this.partidoService.cronometroDisplay;
  }

  iniciarPartido() {
    this.partidoService.iniciarPartido();
  }


nuevoPartido() {
  this.partidoService.crearNuevoPartido(this.nombreRival);
}

  pausarPartido() {
    this.partidoService.pausarPartido();
  }

  reiniciarPartido() {
    this.partidoService.reiniciarPartidoCompleto();
  

  }

  alternarCampo(id: number) {
    this.jugadorService.alternarCampo(id);
  }
}
