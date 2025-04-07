import { Component } from '@angular/core';
import { JugadorService } from '../../servicios/jugador.service';
import { Jugador } from '../../models/jugador.model';
import { FirebaseService } from 'src/app/servicios/firebase/firebase.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { JugadoresService } from 'src/app/servicios/dominio/jugadores.service.service';

@Component({
  selector: 'app-jugadores',
  templateUrl: './jugadores.component.html',
  styleUrls: ['./jugadores.component.css'],
})
export class JugadoresComponent {
  jugadorForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private jugadoresService: JugadoresService,
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
    this.jugadoresService.obtenerJugadores().then(jugadores => {
      this.jugadoresDisponibles = jugadores
    })

  }

  ngOnDestroy() {
    // ¡Siempre cancelar la suscripción!
    if (this.jugadoresSub) this.jugadoresSub.unsubscribe();
  }

  onSubmit() {
    if (this.jugadorForm.invalid) return;

    const nuevoJugador = this.jugadorForm.value;

  }

  
  

  agregarJugadorPrueba() {

  
  }

  eliminarJugador(id: string) {

  }
  

  verJugador(jugador: Jugador) {
    console.log("Ver jugador:", jugador);
    // Aquí puedes abrir un modal o redirigir
  }
  
  editarJugador(jugador: Jugador) {
    console.log("Editar jugador:", jugador);
    this.router.navigate(['/modificar-jugador', jugador.id]);
  }
}
