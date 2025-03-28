import { Injectable } from '@angular/core';
import { Jugador } from '../models/jugador.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JugadorService {
  private jugadores: Jugador[] = [];
  private siguienteId = 1;

  partidoEnCurso: boolean = false;
  cronometroSegundos: number = 0;
  cronometroDisplay: string = '00:00';

  private cronometroInterval: any;
  private sumaMinutosInterval: any;

  constructor(private http: HttpClient) {
    this.cargarJugadoresDesdeJson();
  }

  // ✅ Cargar jugadores desde JSON
  cargarJugadoresDesdeJson() {
    this.http.get<any[]>('assets/data/jugadores.json').subscribe(lista => {
      lista.forEach(j => {
        this.agregarJugador(j.nombre, j.dorsal, j.foto); // ← añade el campo foto
      });
    });
    
  }

  // ✅ Jugadores
  getJugadores(): Jugador[] {
    return this.jugadores;
  }

  agregarJugador(nombre: string, dorsal: number, foto?: string) {
    this.jugadores.push({
      id: this.siguienteId++,
      nombre,
      dorsal,
      foto: foto || '', // si viene, la usa; si no, queda vacío
      enCampo: false,
      minutosJugados: 0
    });
  }
  

  alternarCampo(jugadorId: number) {
    const jugador = this.jugadores.find(j => j.id === jugadorId);
    if (jugador) {
      jugador.enCampo = !jugador.enCampo;
    }
  }

  // ✅ Minutos jugados
  sumarMinutoAJugadoresEnCampo() {
    this.jugadores.forEach(j => {
      if (j.enCampo) {
        j.minutosJugados++;
      }
    });
  }

  reiniciarPartido() {
    this.jugadores.forEach(j => {
      j.enCampo = false;
      j.minutosJugados = 0;
    });
  }

  // ✅ Cronómetro
  iniciarPartido() {
    if (this.partidoEnCurso) return;
    this.partidoEnCurso = true;

    // Cronómetro visual (cada segundo)
    this.cronometroInterval = setInterval(() => {
      this.cronometroSegundos++;
      this.actualizarDisplay();
    }, 1000);

    // Suma de minutos (cada 60 segundos reales — o usar 5000 para pruebas)
    this.sumaMinutosInterval = setInterval(() => {
      this.sumarMinutoAJugadoresEnCampo();
    }, 1000);
  }

  pausarPartido() {
    if (!this.partidoEnCurso) return;
    this.partidoEnCurso = false;
    clearInterval(this.cronometroInterval);
    clearInterval(this.sumaMinutosInterval);
  }

  reiniciarPartidoCompleto() {
    this.pausarPartido();
    this.cronometroSegundos = 0;
    this.cronometroDisplay = '00:00';
    this.reiniciarPartido();
  }

  private actualizarDisplay() {
    const minutos = Math.floor(this.cronometroSegundos / 60);
    const segundos = this.cronometroSegundos % 60;
    this.cronometroDisplay = `${this.formatear(minutos)}:${this.formatear(segundos)}`;
  }

  private formatear(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
}
