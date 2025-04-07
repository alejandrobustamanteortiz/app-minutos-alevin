import { Component } from '@angular/core';
import { Jugador } from 'src/app/models/jugador.model';
import { PartidosService } from 'src/app/servicios/dominio/partidos.service';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-alineacion',
  templateUrl: './alineacion.component.html',
  styleUrls: ['./alineacion.component.css']
})
export class AlineacionComponent {

  jugadoresConvocados: Jugador[] = [];
  partidoId: string | undefined



  constructor(private partidosService: PartidosService, private route: ActivatedRoute){
    this.partidoId = this.route.snapshot.paramMap.get('id')!;
    console.log('el partido is es' +this.partidoId)
    this.partidosService.obtenerPartidoById(this.partidoId).then(partido => {
      this.jugadoresConvocados = partido.jugadoresConvocados || [];
      console.log('los jugadores convocados son' +this.jugadoresConvocados)
    });
  }




}
