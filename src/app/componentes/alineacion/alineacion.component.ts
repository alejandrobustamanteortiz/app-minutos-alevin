import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Formacion } from 'src/app/models/formacion.model';
import { Jugador } from 'src/app/models/jugador.model';
import { Partido } from 'src/app/models/partido.model';
import { PartidosService } from 'src/app/servicios/dominio/partidos.service';
import { FormacionFirebaseService } from 'src/app/servicios/firebase/formacion.firebase.service';
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
  jugadoresTitularesPrimeraParte: Jugador[] = []
  jugadoresSuplentesPrimeraParte: Jugador[] = []
  titularesAsignados: { [index: number]: Jugador | null } = {};
  idFormacion!: string
  formacionesDisponibles: Formacion[] = []
  partido!: Partido

  //Para crear formaciones, to delete
  formacion: Formacion = {
      "nombre": "2-3-2",
      "disposicion": [2, 3, 2, 1],
      "lineIndex": 0
}

  formacionSeleccionada = this.formacionesDisponibles[0]; //se puede ajustar, ¿cual quieres qué alineacio salta primero
  posicionSeleccionada: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private partidosService: PartidosService,
    private partidosFirebaseService: PartidosFirebaseService,
    private formacionFirebase: FormacionFirebaseService
  ) {}

  ngOnInit(): void {

    this.partidoId = this.route.snapshot.paramMap.get('id')!;



    this.partidosService.obtenerPartidoById(this.partidoId).then(partido => {

      this.partido = partido; // Guarda todo el objeto para futuras referencias
      const estado = partido.estado; // Suponiendo que tiene un campo "estado"

       switch (estado) {
      case 'esperando':
        this.inicializarPorComenzar(partido);
        break;

      case 'live':
        this.inicializarEnJuego(partido);
        break;

      case 'finalizado':
        this.inicializarFinalizado(partido);
        break;

      default:
        console.warn('Estado de partido no reconocido:', estado);
    }
  });



      // this.jugadoresDisponibles = partido.jugadoresConvocados || [];
      // this.jugadoresTitularesPrimeraParte = partido.alineaciones?.primeraParte || [];
      // this.titularesAsignados = partido.alineaciones?.primeraParteTitulares || [];
      // this.idFormacion = "-OWA0rrhhgx9qa7ylRxt";
      // this.formacionSeleccionada =this.formacionesDisponibles[0]
 

    this.obtenerFormaciones().then(formaciones => {
    this.formacionesDisponibles = formaciones;
    this.formacionSeleccionada =this.formacionesDisponibles[0]
  });
  }

  async cargarFormaciones() {
  const formaciones: Formacion[] = await this.formacionFirebase.obtenerTodasFormacionesOnce()
  console.log(formaciones); // ya puedes usarlas como array
}


  seleccionarPosicion(index: number): void {
    this.posicionSeleccionada = index;
    console.log('la posicion seleccionada es' + this.posicionSeleccionada) // del 0 al 7 portero es el n7
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


  guardarPrimeraParte(): void {
    const titulares = Object.values(this.titularesAsignados).filter(jugador => !!jugador) as Jugador[] ;

    if (titulares.length !== 8) {
      alert('Debes seleccionar 8 titulares.');
      return;
    }
    this.partidosFirebaseService.guardarPrimeraParte(titulares as Jugador[], this.partidoId);
    this.partidosFirebaseService.guardarFormacionPrimeraParte(this.formacionSeleccionada, this.partidoId)
    alert('✅ Alineacion primera parte OK.');
  }

  cambiarFormacion(formacion: any): void {
    this.formacionSeleccionada = formacion;
    this.titularesAsignados = {}; // Vaciar titulares
    this.jugadoresDisponibles = [...this.jugadoresDisponibles];
  }

  getPosIndex(lineaIndex: number, posicionIndex: number, disposicion: number[]): number {
    let index = 0;
    for (let i = 0; i < lineaIndex; i++) {
      index += disposicion[i];
    }
    return index + posicionIndex;
  }

  emojiPorLinea(lineIndex: number): string {

    if (lineIndex<=3)

    switch (lineIndex) {
      case 0: return '⚽'; // Delanteros
      case 1: return '🎯'; // Medios
      case 2: return '🛡️'; // Defensas
      case 3: return '🧤'; // Portero
      default: return '❓';
    } 
    else

     switch (lineIndex) {
      case 0: return '⚽'; // Delanteros
      case 1: return '🎯'; // Medios
      case 2: return '🛡️'; // Pivote defensivo
      case 3: return '🛡️'; // Defensas
      case 4: return '🧤'; // Portero
      default: return '❓';

  }}
  
  addFormacion(): void {
    this.formacionFirebase.guardarFormacion(this.formacion)
  }

  deleteFormacion(): void {
    this.formacionFirebase.eliminarFormacion(this.idFormacion)
  }
  
  obtenerFormaciones(): Promise<Formacion[]> {
    return this.formacionFirebase.obtenerTodasFormacionesOnce()


  }

  inicializarPorComenzar(partido: Partido) {
  const todosLosJugadores = partido.jugadoresConvocados || [];

  const titularesArray = Object.values(partido.alineaciones?.primeraParte ?? {}).filter(j => j !== null) as Jugador[];

  this.titularesAsignados = titularesArray;

  this.jugadoresSuplentesPrimeraParte = todosLosJugadores.filter(j =>
    !titularesArray.some(t => t.id === j.id)
  );
}
  inicializarEnJuego(partido: Partido){}
  inicializarFinalizado(partido: Partido){}


  
}
