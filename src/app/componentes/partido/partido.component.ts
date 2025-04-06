import { Component } from '@angular/core';
import { Jugador } from '../../models/jugador.model';
import { JugadorService } from '../../servicios/jugador.service';
import { PartidoService } from '../../servicios/partido.service';
import { FirebaseService } from 'src/app/servicios/firebase/firebase.service';
import { Partido } from 'src/app/models/partido.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-partido',
  templateUrl: './partido.component.html',
  styleUrls: ['./partido.component.css'],
})
export class PartidoComponent {
  partidos: Partido[] = [];
  partidoId!: string;
  partidoData: any;
  jugadoresConvocados: any[] = [];
  jugadoresTitulares: any[] = [];
  jugadoresSuplentes: any[] = [];
  nombreRival: string = '';
  partidosDisponibles: { id: string; rival: string }[] = [];
  partidoSeleccionadoId: string = '';

  

  ngOnInit() {


  }

  constructor(
    public jugadorService: JugadorService,
    public partidoService: PartidoService,
    private route: ActivatedRoute
  ) {}




  get titulares(): Jugador[] {
    return this.jugadoresConvocados?.filter((j: { enCampo: any; }) => j.enCampo) || [];
  }

  get suplentes(): Jugador[] {
    return this.jugadoresConvocados?.filter((j: { enCampo: any; }) => !j.enCampo) || [];
  }





  

  get cronometro(): string {
    return this.partidoService.cronometroDisplay;
  }



  
  alternarCampo(id: number): void {
    // Buscar primero en suplentes
    const indexSuplente = this.jugadoresSuplentes.findIndex(j => j.id === id);
    if (indexSuplente !== -1) {
      const jugador = this.jugadoresSuplentes[indexSuplente];
      jugador.enCampo = true;
      this.jugadoresSuplentes.splice(indexSuplente, 1);
      this.jugadoresTitulares.push(jugador);
      return;
    }

    // Buscar en los que están en campo
    const indexCampo = this.jugadoresTitulares.findIndex(j => j.id === id);
    if (indexCampo !== -1) {
      const jugador = this.jugadoresTitulares[indexCampo];
      jugador.enCampo = false;
      this.jugadoresTitulares.splice(indexCampo, 1);
      this.jugadoresSuplentes.push(jugador);
    }
  }
}
