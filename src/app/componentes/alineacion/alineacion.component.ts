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
  titulares: Jugador[]=[]
  suplentes: Jugador[]=[]
  formacionesDisponibles = [
    { nombre: '2-3-2', disposicion: [2, 3, 2, 1] },
    { nombre: '2-1-3-1', disposicion: [1,3, 1, 2, 1] },
    { nombre: '3-3-1', disposicion: [1, 3, 3, 1] }
  ];
  formacionSeleccionada = this.formacionesDisponibles[0]; // Por defecto

  constructor(private partidosService: PartidosService, private route: ActivatedRoute){
    this.partidoId = this.route.snapshot.paramMap.get('id')!;
    this.partidosService.obtenerPartidoById(this.partidoId).then(partido => {
      this.jugadoresConvocados = partido.jugadoresConvocados || [];
    });


  }

  cambiarFormacion(formacion: any) {
    this.formacionSeleccionada = formacion;
    this.titulares = [];
    this.suplentes = [...this.jugadoresConvocados];
  }

  seleccionarJugador(jugador: Jugador): void {
    if (this.titulares.length < 8) {
      this.titulares.push(jugador);
      this.jugadoresConvocados = this.jugadoresConvocados.filter(j => j.id !== jugador.id);
    } else {
      alert('Ya tienes 8 titulares asignados.');
    }
  }

  nombreJugadorEnPosicion(index: number): string {
    return this.titulares[index]?.nombre || 'Vacío';
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

  getPosIndex(lineaIndex: number, posicionIndex: number, disposicion: number[]): number {
    let index = 0;
    for (let i = 0; i < lineaIndex; i++) {
      index += disposicion[i];
    }
    return index + posicionIndex;
  }


  confirmarAlineacion(): void {
    const idsTitulares = this.titulares.map(j => j.id);
    if (idsTitulares.length !== 8) {
      alert('Debes seleccionar 8 titulares.');
      return;
    }
    //this.partidosService.guardarAlineacionParte(this.partidoId, 'primeraParte', idsTitulares);
    alert('✅ Alineación guardada.');
  }






}
