import { Component } from '@angular/core';
import { JugadorService } from '../../servicios/jugador.service';
import { Jugador } from '../../models/jugador.model';

@Component({
  selector: 'app-partido',
  templateUrl: './partido.component.html',
  styleUrls: ['./partido.component.css']
})
export class PartidoComponent {
  partidoEnCurso: boolean = false;
  intervalId: any;

  constructor(public jugadorService: JugadorService) {}

  get jugadores(): Jugador[] {
    return this.jugadorService.getJugadores();
  }

  iniciarPartido() {
    if (this.partidoEnCurso) return;
    this.partidoEnCurso = true;
    this.intervalId = setInterval(() => {
      this.jugadorService.sumarMinutoAJugadoresEnCampo();
    }, 1000); // cada 60.000 ms = 1 minuto
  }

  pausarPartido() {
    if (!this.partidoEnCurso) return;
    this.partidoEnCurso = false;
    clearInterval(this.intervalId);
  }

  reiniciarPartido() {
    this.jugadorService.reiniciarPartido();
    this.pausarPartido();
  }
}
