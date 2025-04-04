import { Component } from '@angular/core';
import { JugadorService } from '../../servicios/jugador.service';
import { Jugador } from '../../models/jugador.model';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-jugadores',
  templateUrl: './jugadores.component.html',
  styleUrls: ['./jugadores.component.css'],
})
export class JugadoresComponent {
  constructor(
    private firebaseService: FirebaseService,
    private fb: FormBuilder
  ) {}

  jugadoresDisponibles: Jugador[] = [];
  jugador: Jugador[] = [];
  jugadoresSub!: Subscription;


  ngOnInit() {
    this.jugadoresSub = this.firebaseService.getJugadores().subscribe({
      next: (jugadores) => {
        this.jugadoresDisponibles = jugadores;
      },
      error: (err) => {
        console.error('Error en tiempo real:', err);
      }
    });
  }

  ngOnDestroy() {
    // ¡Siempre cancelar la suscripción!
    if (this.jugadoresSub) this.jugadoresSub.unsubscribe();
  }
  

  agregarJugadorPrueba() {

    //hay que facer formulario correctamente
    const nuevoJugador: Omit<Jugador, 'id'> = {
      nombre: 'Prueba Firebase',
      foto: 'ander.png',
      dorsal: 99,
      minutosJugados: 0,
      enCampo: false,
    };
    this.firebaseService
      .agregarJugador(nuevoJugador)
      .then(() => {
        console.log('✅ Jugador añadido correctamente');
      })
      .catch((err) => {
        console.error('❌ Error al añadir jugador:', err);
      });
  }

  eliminarJugador(id: string) {
    const confirmar = confirm('¿Seguro que quieres eliminar este jugador?');
    if (!confirmar) return;
  
    this.firebaseService.eliminarJugador(id)
      .then(() => {
        console.log('🗑️ Jugador eliminado correctamente');
        this.jugadoresDisponibles = this.jugadoresDisponibles.filter(j => j.id !== id);
      })
      .catch(err => {
        console.error('❌ Error al eliminar jugador:', err);
      });
  }
}
