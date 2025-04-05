import { Component, OnInit } from '@angular/core';
import { Partido } from 'src/app/models/partido.model';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { PartidoService } from 'src/app/servicios/partido.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-partidos',
  templateUrl: './partidos.component.html',
  styleUrls: ['./partidos.component.css'] // si tienes estilos
})
export class PartidosComponent implements OnInit {

  partidos: Partido[] = [];

  constructor(private partidoService: PartidoService, private firebaseService: FirebaseService, private router: Router) {}

  partidosDisponibles: Partido[]=[]

  async ngOnInit() {
    try {
      this.partidosDisponibles = await this.firebaseService.getPartidosOnce();
      console.log(
        '📦 Jugadores disponibles para la convocatoria:',
        this.partidosDisponibles
      );
    } catch (err) {
      console.error('❌ Error al obtener jugadores', err);
    }

  }

  


  jugadrPartido(partido: any) {
    this.router.navigate(['/en-juego', partido.id]);
    // redirige o abre un diálogo
  }
  
  editarPartido(partido: any) {
    this.router.navigate(['/editar', partido.id]);
  }
  
  eliminarPartido(partido: any) {
    if (confirm(`¿Seguro que quieres eliminar el partido contra ${partido.rival}?`)) {
      const id = partido.id; // 👈 Nos aseguramos de tener el ID
      this.partidoService.eliminarPartido(id)
        .then(() => {
          alert('🗑️ Partido eliminado');
          this.partidosDisponibles = this.partidosDisponibles.filter(p => p.id !== id);
        })
        .catch(err => {
          console.error('❌ Error al eliminar partido', err);
        });
    }
  }
}