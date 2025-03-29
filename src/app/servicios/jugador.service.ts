import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Jugador } from '../models/jugador.model';
import { onValue } from '@angular/fire/database';

// Firebase
import { Database, getDatabase, ref, set, get } from '@angular/fire/database';

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

  private db: Database;

  constructor(private http: HttpClient) {
    this.db = inject(Database);
    this.cargarEstado().then(cargado => {
      if (!cargado) {
        // 🟡 Solo si no había estado remoto, cargar desde JSON
        this.cargarJugadoresDesdeJson();
      }
    });
    this.inicializarEscuchaEnTiempoReal();

    // Prueba de conexión (opcional)
    const testRef = ref(this.db, 'testFirebaseWrite');
    set(testRef, {
      mensaje: '✅ Firebase conectado',
      timestamp: new Date().toISOString()
    }).then(() => console.log('🔥 Firebase OK'))
      .catch((err: any) => console.error('❌ Firebase ERROR', err));
  }

  cargarJugadoresDesdeJson() {
    this.http.get<any[]>('assets/data/jugadores.json').subscribe(lista => {
      lista.forEach(j => this.agregarJugador(j.nombre, j.dorsal, j.foto));
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

  inicializarEscuchaEnTiempoReal() {
    const estadoRef = ref(this.db, 'partidoActual');
  
    onValue(estadoRef, snapshot => {
      const estado = snapshot.val();
      if (!estado) return;
  
      // 🧠 No sobreescribas si ya estás en ese estado
      const eraEnCurso = this.partidoEnCurso;
      this.jugadores = (estado.jugadores || []).map((j: any, i: number) => ({
        id: j.id ?? i + 1,
        nombre: j.nombre,
        dorsal: j.dorsal,
        foto: j.foto || '',
        enCampo: j.enCampo || false,
        minutosJugados: j.minutosJugados || 0
      }));
  
      this.cronometroSegundos = estado.cronometroSegundos || 0;
      this.fechaInicio = estado.fechaInicio || null;
      this.partidoEnCurso = estado.partidoEnCurso || false;
  
      this.actualizarDisplay();
  
      // Si el estado cambia de pausado a en curso (o viceversa)
      if (!this.partidoEnCurso) {
        clearInterval(this.cronometroInterval);
        clearInterval(this.sumaMinutosInterval);
      } else if (!eraEnCurso && this.partidoEnCurso) {
        this.iniciarIntervalos();
      }
    });
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
    }, 1000); // Cambiar a 60000 en producción
  }

  guardarEstado() {
    const estado = {
      jugadores: this.jugadores,
      cronometroSegundos: this.cronometroSegundos,
      fechaInicio: this.fechaInicio,
      partidoEnCurso: this.partidoEnCurso
    };

    set(ref(this.db, 'partidoActual'), estado)
      .then(() => console.log('✅ Estado guardado en Firebase'))
      .catch((error: any) => console.error('❌ Error al guardar en Firebase', error));
  }

  borrarEstado() {
    set(ref(this.db, 'partidoActual'), null)
      .then(() => console.log('🗑️ Estado eliminado de Firebase'))
      .catch((error: any) => console.error('❌ Error al borrar en Firebase', error));
  }

  cargarEstado(): Promise<boolean> {
    const estadoRef = ref(this.db, 'partidoActual');
  
    return get(estadoRef)
      .then(snapshot => {
        if (snapshot.exists()) {
          const estado = snapshot.val();
  
          this.jugadores = (estado.jugadores || []).map((j: any, i: number) => ({
            id: j.id ?? i + 1,
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
          return true;
        } else {
          return false;
        }
      })
      .catch((error: any) => {
        console.error('❌ Error al cargar el estado desde Firebase', error);
        return false;
      });
  }
}
