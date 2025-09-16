import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../servicios/firebase/firebase.service';
import { Partido } from '../../models/partido.model';
import { PartidosService } from 'src/app/servicios/dominio/partidos.service';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.css']
})
export class ResumenComponent implements OnInit {
  partidos: Partido[] = [];
  cargando = true;

  constructor(private firebaseService: FirebaseService, private partidosService: PartidosService,) {}

   ngOnInit(): void {
    this.partidosService.obtenerTodosLosPartidos()
      .then(partidos => {
        this.partidos = partidos;
        this.cargando = false;
      })
      .catch(err => {
        console.error('Error cargando partidos:', err);
        this.cargando = false;
      });
  }
}

