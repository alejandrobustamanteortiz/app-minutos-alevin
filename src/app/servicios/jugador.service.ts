import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Jugador } from '../models/jugador.model';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class JugadorService {
  private _jugadores: Jugador[] = [];
  private siguienteId = 1;

  partidoEnCurso: boolean = false;
  cronometroSegundos: number = 0;
  cronometroDisplay: string = '00:00';
  fechaInicio: number | null = null;

  private partidoId = 'partidoActual';
  private cronometroInterval: any;
  private sumaMinutosInterval: any;

  constructor(
    private http: HttpClient,
    private firebaseService: FirebaseService
  ) {
    this.cargarJugadoresDesdeJson(); // Puedes llamarlo aquí o desde otro lugar
  }

  // 📥 Obtener jugadores
  getJugadores(): Jugador[] {
    return this._jugadores;
  }

  // 📤 Establecer jugadores
  setJugadores(jugadores: Jugador[]) {
    this._jugadores = jugadores;
  }

  // Titulares en el campo
  getTitulares(): Jugador[] {
    return this._jugadores.filter(j => j.enCampo);
  }

  agregarJugador(nombre: string, dorsal: number, foto?: string) {
    this._jugadores.push({
      id: this.siguienteId++,
      nombre,
      dorsal,
      foto: foto || '',
      enCampo: false,
      minutosJugados: 0
    });
    this.guardarEstado();
  }

  alternarCampo(jugadorId: number) {
    const jugador = this._jugadores.find(j => j.id === jugadorId);
    if (jugador) {
      jugador.enCampo = !jugador.enCampo;
      this.guardarEstado();
    }
  }

  cargarJugadoresDesdeJson() {
    this.http.get<any[]>('assets/data/jugadores.json').subscribe(lista => {
      lista.forEach(j => this.agregarJugador(j.nombre, j.dorsal, j.foto));
    });
  }

  sumarMinutoAJugadoresEnCampo() {
    this._jugadores.forEach(j => {
      if (j.enCampo) j.minutosJugados++;
    });
    this.guardarEstado();
  }

  guardarEstado() {
    const estado = {
      jugadores: this._jugadores,
      cronometroSegundos: this.cronometroSegundos,
      fechaInicio: this.fechaInicio,
      partidoEnCurso: this.partidoEnCurso
    };

    this.firebaseService.guardarEstadoPartido(this.partidoId, estado)
      .then(() => console.log('✅ Estado guardado en Firebase'))
      .catch(error => console.error('❌ Error al guardar en Firebase', error));
  }

  borrarEstado() {
    this.firebaseService.eliminarPartido(this.partidoId)
      .then(() => console.log('🗑️ Estado eliminado de Firebase'))
      .catch(error => console.error('❌ Error al borrar en Firebase', error));
  }
}
