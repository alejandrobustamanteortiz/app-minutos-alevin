import { Component, NgModule, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControlName,
  Validators,
  FormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Partido } from 'src/app/models/partido.model';
import { Jugador } from 'src/app/models/jugador.model';
import { PartidoService } from 'src/app/servicios/partido.service';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FirebaseService } from 'src/app/servicios/firebase/firebase.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JugadorService } from 'src/app/servicios/jugador.service';
import { PartidosService } from 'src/app/servicios/dominio/partidos.service';
import { JugadoresService } from 'src/app/servicios/dominio/jugadores.service.service';

@Component({
  selector: 'app-crear-partido',
  templateUrl: './crear-partido.component.html',
  styleUrls: ['./crear-partido.component.css'],
})
export class CrearPartidoComponent implements OnInit {
  partidoForm!: FormGroup;
  jugadoresDisponibles: Jugador[] = [];
  jugadoresConvocados: Set<string> = new Set(); // IDs seleccionados

  constructor(
    private fb: FormBuilder,
    private jugadoresService: JugadoresService,
    private partidosService: PartidosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.partidoForm = this.fb.group({
      tipoPartido: ['', Validators.required],
      estado: ['', Validators.required],
      jornadaPartido: [''],
      rival: ['', Validators.required],
      fechaPartido: ['', Validators.required],
      duracionParte: [30, [Validators.required, Validators.min(1)]]
    });
  
    // ✅ Cargar jugadores desde el servicio
    this.jugadoresService.obtenerJugadores().then(jugadores => {
      this.jugadoresDisponibles = jugadores;
      
    });
  }

  
  toggleConvocado(jugadorId: string) {
    if (this.jugadoresConvocados.has(jugadorId)) {
      this.jugadoresConvocados.delete(jugadorId); // ❌ Quitar de la convocatoria
    } else {
      this.jugadoresConvocados.add(jugadorId); // ✅ Añadir a la convocatoria
    }
  }
  async onSubmit(): Promise<void> {
    if (this.partidoForm.invalid || this.jugadoresConvocados.size === 0) {
      alert('⚠️ Rellena todos los campos y selecciona jugadores.');
      return;
    }
  
    try {
      const nuevoId = await this.partidosService.crearPartidoDesdeFormulario(
        this.partidoForm.value,
        this.jugadoresDisponibles,
        Array.from(this.jugadoresConvocados)
      );
  
      alert('✅ Partido creado con ID: ' + nuevoId);
      this.partidoForm.reset();
      this.jugadoresConvocados.clear();
    } catch (err) {
      console.error('❌ Error al guardar partido:', err);
      alert('Hubo un error al guardar el partido.');
    }
  }
  
}
