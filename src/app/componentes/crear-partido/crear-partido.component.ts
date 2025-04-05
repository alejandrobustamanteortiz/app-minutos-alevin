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
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JugadorService } from 'src/app/servicios/jugador.service';

@Component({
  selector: 'app-crear-partido',
  templateUrl: './crear-partido.component.html',
  styleUrls: ['./crear-partido.component.css'],
})
export class CrearPartidoComponent implements OnInit {
  partidoForm: FormGroup;
  jugadoresDisponibles: Jugador[] = [];
  jugadoresConvocados: Set<string> = new Set(); // IDs seleccionados

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private partidoService: PartidoService,
    private router: Router
  ) {
    this.partidoForm = this.fb.group({
      rival: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      duracionParte: [30, [Validators.required, Validators.min(1)]],
      tipoPartido: ['', Validators.required]
    });
  }

  async ngOnInit() {
    try {
      this.jugadoresDisponibles = await this.firebaseService.getJugadoresOnce();
      console.log(
        '📦 Jugadores disponibles para la convocatoria:',
        this.jugadoresDisponibles
      );
    } catch (err) {
      console.error('❌ Error al obtener jugadores', err);
    }
  }

  onSubmit() {
    if (this.partidoForm.invalid || this.jugadoresConvocados.size === 0) {
      alert('⚠️ Completa todos los campos y selecciona al menos un jugador.');
      return;
    }

    const formValue = this.partidoForm.value;

    const partido = {
      ...formValue,
      fechaInicio: formValue.fechaInicio ? formValue.fechaInicio.getTime() : null, // 👈 Transforma la fecha
      jugadoresConvocados: Array.from(this.jugadoresConvocados),
      estado: "No comenzado",
      tipoPartido: formValue.tipoPartido
    };

    this.partidoService.crearPartido(partido)
      .then(() => {
        alert('✅ Partido creado con éxito');
        this.router.navigate(['/']); // Redirige donde quieras
      })
      .catch((err) => {
        console.error('❌ Error al guardar el partido:', err);
      });
  }
  toggleConvocado(jugadorId: string) {
    if (this.jugadoresConvocados.has(jugadorId)) {
      this.jugadoresConvocados.delete(jugadorId); // ❌ Quitar de la convocatoria
    } else {
      this.jugadoresConvocados.add(jugadorId); // ✅ Añadir a la convocatoria
    }
  }
}
