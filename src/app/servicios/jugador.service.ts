import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Jugador } from '../models/jugador.model';

// Firebase (modular SDK)
import { getDatabase, ref, set, Database } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class JugadorService {
  private jugadores: Jugador[] = [];
  private siguienteId = 1;

  partidoEnCurso: boolean = false;
  cronometroSegundos: number = 0;
  cronometroDisplay: string = '00:00';
  fechaInicio: number | null = null;

  private cronometroInterval: any;
  private sumaMinutosInterval: any;

  constructor(private http: HttpClient) {
    // Firebase test (con delay para evitar error de inicialización)
    setTimeout(() => {
      try {
        const db = getDatabase();
        const testRef = ref(db, 'testFirebaseWrite');

        set(testRef, {
          mensaje: '🔥 Firebase conectado correctamente',
          timestamp: new Date().toISOString()
        })
          .then(() => console.log('✅ Firebase FUNCIONA 🔥'))
          .catch(err => console.error('❌ ERROR al escribir en Firebase', err));
      } catch (error) {
        console.error('🚨 Error al conectar con Firebase:', error);
      }
    }, 0);

    this.cargarEstado();
    if (this.jugadores.length === 0) {
      this.cargarJugadoresDesdeJson();
    }
  }

  cargarJugadoresDesdeJson() {
    this.http.get<any[]>('assets/data/jugadores.json').subscribe(lista => {
      lista.forEach(j => {
        this.agregarJugador(j.nombre, j.dorsal, j.foto);
      });
    });
  }

  getJugadores(): Jugador[] {
    return this.jugadores;
  }

  agregarJugador(nombre: string, dorsal: number, foto?: string) {
    this.jugadores.push({
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
    const jugador = this.jugadores.find(j => j.id === jugadorId);
    if (jugador) {
      jugador.enCampo = !jugador.enCampo;
      this.guardarEstado();
    }
  }

  sumarMinutoAJugadoresEnCampo() {
    this.jugadores.forEach(j => {
      if (j.enCampo) {
        j.minutosJugados++;
      }
    });
    this.guardarEstado();
  }

  reiniciarPartido() {
    this.jugadores.forEach(j => {
      j.enCampo = false;
      j.minutosJugados = 0;
    });
    this.cronometroSegundos = 0;
    this.actualizarDisplay();

    this.fechaInicio = null;
    this.partidoEnCurso = false;

    this.borrarEstado();
  }

  iniciarPartido() {
    if (this.partidoEnCurso) return;
    this.partidoEnCurso = true;

    if (!this.fechaInicio) {
      this.fechaInicio = Date.now();
    }

    this.iniciarIntervalos();
    this.guardarEstado();
  }

  pausarPartido() {
    if (!this.partidoEnCurso) return;

    clearInterval(this.cronometroInterval);
    clearInterval(this.sumaMinutosInterval);

    this.partidoEnCurso = false;
    this.fechaInicio = null;

    this.guardarEstado();
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

  private iniciarIntervalos() {
    this.cronometroInterval = setInterval(() => {
      this.cronometroSegundos++;
      this.actualizarDisplay();
    }, 1000);

    this.sumaMinutosInterval = setInterval(() => {
      this.sumarMinutoAJugadoresEnCampo();
    }, 1000); // Cambiar a 60000 para producción
  }

  guardarEstado() {
    const estado = {
      jugadores: this.jugadores,
      cronometroSegundos: this.cronometroSegundos,
      fechaInicio: this.fechaInicio,
      partidoEnCurso: this.partidoEnCurso
    };
    localStorage.setItem('estadoPartido', JSON.stringify(estado));
  }

  borrarEstado() {
    localStorage.removeItem('estadoPartido');
  }

  cargarEstado() {
    const data = localStorage.getItem('estadoPartido');
    if (data) {
      const estado = JSON.parse(data);

      this.jugadores = (estado.jugadores || []).map((j: any, index: number) => ({
        id: j.id ?? index + 1,
        nombre: j.nombre,
        dorsal: j.dorsal,
        foto: j.foto || '',
        enCampo: j.enCampo || false,
        minutosJugados: j.minutosJugados || 0
      }));

      this.cronometroSegundos = estado.cronometroSegundos || 0;
      this.fechaInicio = estado.fechaInicio || null;
      this.partidoEnCurso = estado.partidoEnCurso || false;

      if (this.partidoEnCurso && this.fechaInicio) {
        const ahora = Date.now();
        const segundosPasados = Math.floor((ahora - this.fechaInicio) / 1000);
        const minutosPasados = Math.floor(segundosPasados / 60);

        this.cronometroSegundos += segundosPasados;

        this.jugadores.forEach(j => {
          if (j.enCampo) {
            j.minutosJugados += minutosPasados;
          }
        });

        this.fechaInicio = ahora;

        this.guardarEstado();
        this.iniciarIntervalos();
      }

      this.actualizarDisplay();
    }
  }
}
