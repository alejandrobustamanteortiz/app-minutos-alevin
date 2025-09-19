import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CronometroService } from 'src/app/servicios/cronometro.service';
import { PartidosService } from 'src/app/servicios/dominio/partidos.service';
import { Jugador } from 'src/app/models/jugador.model';
import { Partido } from 'src/app/models/partido.model';

@Component({
  selector: 'app-en-juego',
  templateUrl: './en-juego.component.html',
  styleUrls: ['./en-juego.component.css'],
})
export class EnJuegoComponent implements OnInit {
  partidoId!: string;
  titulares: Jugador[] = [];
  suplentes: Jugador[] = [];
  rival?: string;
  titularSeleccionado: Jugador | null = null;
  suplenteSeleccionado: Jugador | null = null;

  tiempo$ = this.cronometroService.tiempo$;
  minutos$ = this.cronometroService.minutos$;

  partidoEnCurso = false;
  estadoPrimeraParte: string | undefined;
  estadoSegundaParte: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private cronometroService: CronometroService,
    private partidosService: PartidosService
  ) {}

  async ngOnInit(): Promise<void> {
    this.partidoId = this.route.snapshot.paramMap.get('id')!;

    const partido: Partido = await this.partidosService.obtenerPartidoById(this.partidoId);

    this.rival = partido.rival;
    this.estadoPrimeraParte = partido.estadoPrimeraParte;

    const jugadores = partido.jugadoresConvocados || [];

    let titularesIds: string[] = [];

    if (partido.estadoPrimeraParte === 'esperando' || partido.estadoPrimeraParte === 'live') {
      titularesIds = (partido.alineaciones?.primeraParte || []).map((j: any) =>
        typeof j === 'string' ? j : j.id
      );
    } else if (
      partido.estadoPrimeraParte === 'descanso' ||
      partido.estadoPrimeraParte === 'finalizado'
    ) {
      titularesIds = (partido.alineaciones?.segundaParte || []).map((j: any) =>
        typeof j === 'string' ? j : j.id
      );
    }

    // 🔹 Asignar a propiedades de la clase
    this.titulares = jugadores.filter(j => j.id && titularesIds.includes(j.id));
    this.suplentes = jugadores.filter(j => j.id && !titularesIds.includes(j.id));

    console.log('Titulares:', this.titulares);
    console.log('Suplentes:', this.suplentes);
  }



  async iniciarPrimeraParte() {
  this.partidoEnCurso = true;

  // 🔹 Iniciar cronómetro con titulares
  this.cronometroService.iniciarCrono(this.partidoId, this.titulares);

  this.partidosService.iniciarPrimeraParte({
    id: this.partidoId,
    estadoPrimeraParte: 'live',
  } as Partido);

  this.estadoPrimeraParte = 'live';

  // Llamamos al servicio para actualizar Firebase
  await this.partidosService.iniciarPrimeraParte({
    id: this.partidoId,
    estadoPrimeraParte: 'live',
    
  } as Partido);

  // Actualizamos el estado local para la UI
  this.estadoPrimeraParte = 'live';

  // Si quieres iniciar cronómetro
   this.cronometroService.iniciar();
}

  async iniciarSegundaParte() {
  this.partidoEnCurso = true;

  // Llamamos al servicio para actualizar Firebase
  await this.partidosService.iniciarSegundaParte({
    id: this.partidoId,
    estadoSegundaParte: 'live',
    estadoPrimeraParte: 'finalizado'
  } as Partido);

  // Actualizamos el estado local para la UI
  this.estadoSegundaParte = 'live';
  this.estadoPrimeraParte = 'finalizado'

  // Si quieres iniciar cronómetro
  // this.cronometroService.iniciarCrono(this.partidoId);
}

async finalizarPrimeraParte() {
  this.partidoEnCurso = false;

  // Actualizamos Firebase
  await this.partidosService.finalizarPrimeraParte({
    id: this.partidoId
  } as Partido);

  // Actualizamos estado local para la UI
  this.estadoPrimeraParte = 'descanso';

  // Detener cronómetro si es necesario
   this.cronometroService.pausar();
   this.cronometroService.reiniciar();
   this.cronometroService.detenerCrono();
}




async finalizarSegundaParte() {
  this.partidoEnCurso = false;

  // Actualizamos Firebase
  await this.partidosService.finalizarSegundaParte({
    id: this.partidoId,
    estadoSegundaParte: 'finalizado',
    estadoPrimeraParte: 'finalizado'
  } as Partido);

  // Actualizamos estado local para la UI
  this.estadoPrimeraParte = 'finalizado';
  this.estadoSegundaParte = 'finalizado';

  // Detener cronómetro si es necesario
  // this.cronometroService.detenerCrono(this.partidoId);
}

seleccionarTitular(j: Jugador) {
  this.titularSeleccionado = j;
  console.log("Titular seleccionado:", j.nombre);
}

seleccionarSuplente(j: Jugador) {
  this.suplenteSeleccionado = j;
  console.log("Suplente seleccionado:", j.nombre);
}

cambiarJugador(sale: Jugador, entra: Jugador) {
  // 1. Quitar titular
  this.titulares = this.titulares.filter(j => j.id !== sale.id);

  // 2. Añadir suplente como titular
  entra.enCampo = true;
  this.titulares.push(entra);

  // 3. Quitar suplente de la lista
  this.suplentes = this.suplentes.filter(j => j.id !== entra.id);

  // 4. Añadir titular que salió a suplentes
  sale.enCampo = false;
  this.suplentes.push(sale);

  // 🔹 Importante: actualizar en el cronómetro
  this.cronometroService.actualizarTitulares(this.titulares);

  this.titularSeleccionado = null
  this.suplenteSeleccionado = null

  console.log(`Sustitución: Sale ${sale.nombre}, entra ${entra.nombre}`);
}


}
