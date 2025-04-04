import { Component } from '@angular/core';
import { JugadorService } from '../../servicios/jugador.service';
import { Jugador } from '../../models/jugador.model';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-jugadores',
  templateUrl: './jugadores.component.html',
  styleUrls: ['./jugadores.component.css'],
})
export class JugadoresComponent {
  jugadorForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private router: Router
  ) {
    this.jugadorForm = this.fb.group({
      nombre: ['', Validators.required],
      dorsal: [''],
    });
  }

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

  onSubmit() {
    if (this.jugadorForm.invalid) return;

    const nuevoJugador = this.jugadorForm.value;

    this.firebaseService.agregarJugador(nuevoJugador)
      .then(() => {
        alert('✅ Jugador creado');
        this.router.navigate(['/plantilla']);
      })
      .catch(err => console.error('❌ Error al guardar jugador:', err));
  }

  
  

  agregarJugadorPrueba() {

    //hay que facer formulario correctamente
    const nuevoJugador: Omit<Jugador, 'id'> = {
      nombre: 'Román',
      valoracion: 92,
      foto: 'assets/fotos/roman.png',
      dorsal: 15,
      posicion: 'DFC',
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
