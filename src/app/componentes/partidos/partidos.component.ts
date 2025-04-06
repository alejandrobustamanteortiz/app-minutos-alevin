import { Component, OnInit } from '@angular/core';
import { Partido } from 'src/app/models/partido.model';
import { PartidosService } from 'src/app/servicios/dominio/partidos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-partidos',
  templateUrl: './partidos.component.html',
  styleUrls: ['./partidos.component.css']
})
export class PartidosComponent implements OnInit {
  partidos: Partido[] = [];
  cargando = true;

  constructor(
    private partidosService: PartidosService,
    private router: Router
  ) {}

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

  jugarPartido(partido: Partido): void {
    this.router.navigate(['/en-juego', partido.id]);
  }

  editarPartido(partido: Partido): void {
    this.router.navigate(['/editar', partido.id]);
  }
}
