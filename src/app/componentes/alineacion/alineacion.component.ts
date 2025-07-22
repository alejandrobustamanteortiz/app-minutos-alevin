import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Jugador } from 'src/app/models/jugador.model';
import { PartidosService } from 'src/app/servicios/dominio/partidos.service';
import { PartidosFirebaseService } from 'src/app/servicios/firebase/partidos.firebase.service';

@Component({
  selector: 'app-alineacion',
  templateUrl: './alineacion.component.html',
  styleUrls: ['./alineacion.component.css']
})
export class AlineacionComponent implements OnInit {
  partidoId!: string;
  jugadoresConvocados: Jugador[] = [];
  jugadoresDisponibles: Jugador[] = [];

  formacionesDisponibles = [
    { nombre: '2-3-2', disposicion: [2, 3, 2, 1] },
    { nombre: '3-2-2', disposicion: [3, 2, 2, 1] },
    { nombre: '2-4-1', disposicion: [2, 4, 1, 1] }
  ];

  formacionSeleccionada = this.formacionesDisponibles[0];

  // Mapeo de posiciones a jugadores
  titularesAsignados: { [index: number]: Jugador | null } = {};

  posicionSeleccionada: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private partidosService: PartidosService,
    private partidosFirebaseService: PartidosFirebaseService
  ) {}

  ngOnInit(): void {
    this.partidoId = this.route.snapshot.paramMap.get('id')!;
    this.partidosService.obtenerPartidoById(this.partidoId).then(partido => {
      this.jugadoresConvocados = partido.jugadoresConvocados || [];
      this.jugadoresDisponibles = [...this.jugadoresConvocados];
    });
  }

  seleccionarPosicion(index: number): void {
    this.posicionSeleccionada = index;
  }

  seleccionarJugador(jugador: Jugador): void {
    if (this.posicionSeleccionada === null) {
      alert('Selecciona primero una posición en el campo.');
      return;
    }
    this.titularesAsignados[this.posicionSeleccionada] = jugador;
    this.jugadoresDisponibles = this.jugadoresDisponibles.filter(j => j.id !== jugador.id);
    this.posicionSeleccionada = null; // Reset
  }

  nombreJugadorEnPosicion(index: number): string {
    return this.titularesAsignados[index]?.nombre || 'Vacío';
  }

  guardarPrimeraParte(): void {
    const idsTitulares = Object.values(this.titularesAsignados).map(j => j?.id).filter(id => !!id);

    if (idsTitulares.length !== 8) {
      alert('Debes seleccionar 8 titulares.');
      return;
    }

    this.partidosFirebaseService.guardarPrimeraParte(idsTitulares as string[], this.partidoId);
    alert('✅ Alineacion primera parte OK.');
  }

  cambiarFormacion(formacion: any): void {
    this.formacionSeleccionada = formacion;
    this.titularesAsignados = {}; // Vaciar titulares
    this
    
    .jugadoresDisponibles = [...this.jugadoresConvocados];
  }

  getPosIndex(lineaIndex: number, posicionIndex: number, disposicion: number[]): number {
    let index = 0;
    for (let i = 0; i < lineaIndex; i++) {
      index += disposicion[i];
    }
    return index + posicionIndex;
  }

  emojiPorLinea(lineIndex: number): string {
    switch (lineIndex) {
      case 0: return '🛡️'; // Defensas
      case 1: return '🎯'; // Medios
      case 2: return '⚽'; // Delanteros
      case 3: return '🧤'; // Portero
      default: return '❓';
    }
  }
  
}
