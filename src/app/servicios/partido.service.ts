import { Injectable } from '@angular/core';
import { JugadorService } from './jugador.service';
import { FirebaseService } from './firebase.service';
import { Partido } from '../models/partido.model';

@Injectable({
  providedIn: 'root',
})
export class PartidoService {
  private partidoId = 'partidoActual';
  private parteActual: 1 | 2 = 1;
  private cronometroSegundos = 0;
  private fechaInicio: number | null = null;
  partidoEnCurso = false;

  private cronometroInterval: any;
  private sumaMinutosInterval: any;

  cronometroDisplay: string = '00:00';

  primeraParteFinalizada: boolean = false;
  segundaParteFinalizada: boolean = false;

  constructor(
    private jugadorService: JugadorService,
    private firebaseService: FirebaseService
  ) {
    this.inicializarEscuchaEnTiempoReal(); // escuchando cambios
  
  }

  iniciarPartido() {
    const jugadoresEnCampo = this.jugadorService.getTitulares();
    if (jugadoresEnCampo.length !== 8) {
      alert(
        'Debes seleccionar exactamente 8 jugadores en el campo para comenzar el partido.'
      );
      return;
    }

    if (this.partidoEnCurso) return;

    this.partidoEnCurso = true;
    if (!this.fechaInicio) {
      this.fechaInicio = Date.now();
    }

    this.iniciarIntervalos();
    this.guardarEstado();
  }

  reiniciarPartidoCompleto() {
    this.pausarPartido();
    this.reiniciarPartido();
  }

  reiniciarPartido() {
    this.jugadorService.getJugadores().forEach((j) => {
      j.enCampo = false;
      j.minutosJugados = 0;
    });

    this.cronometroSegundos = 0;
    this.fechaInicio = null;
    this.partidoEnCurso = false;
    this.cronometroDisplay = '00:00';
  }

  private iniciarIntervalos() {
    this.cronometroInterval = setInterval(() => {
      this.cronometroSegundos++;
      this.actualizarDisplay();

      // 🚨 Control automático de fin de parte
      if (this.cronometroSegundos >= 1800) {
        if (this.parteActual === 1 && !this.primeraParteFinalizada) {
          this.finalizarPrimeraParte();
        } else if (this.parteActual === 2 && !this.segundaParteFinalizada) {
          this.finalizarSegundaParte();
        }
      }
    }, 1000);

    this.sumaMinutosInterval = setInterval(() => {
      this.sumarMinutoAJugadoresEnCampo();
    }, 1000); // Cambiar a 60000 para producción
  }

  private actualizarDisplay() {
    const minutos = Math.floor(this.cronometroSegundos / 60);
    const segundos = this.cronometroSegundos % 60;
    this.cronometroDisplay = `${this.formatear(minutos)}:${this.formatear(
      segundos
    )}`;
  }

  public formatear(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  sumarMinutoAJugadoresEnCampo() {
    this.jugadorService.getJugadores().forEach((j) => {
      if (j.enCampo) j.minutosJugados++;
    });
    this.guardarEstado();
  }

  private finalizarPrimeraParte() {
    this.primeraParteFinalizada = true;
    this.parteActual = 2;
    this.pausarPartido();
    console.log('⏱️ Primera parte finalizada automáticamente');
  }

  private finalizarSegundaParte() {
    this.segundaParteFinalizada = true;
    this.pausarPartido();
    console.log('🏁 Partido finalizado automáticamente');
  }

  pausarPartido() {
    if (!this.partidoEnCurso) return;

    clearInterval(this.cronometroInterval);
    clearInterval(this.sumaMinutosInterval);

    this.partidoEnCurso = false;
    this.fechaInicio = null;

    this.guardarEstado();
  }

  guardarEstado() {
    const estado = {
      jugadores: this.jugadorService.getJugadores(),
      cronometroSegundos: this.cronometroSegundos,
      fechaInicio: this.fechaInicio,
      partidoEnCurso: this.partidoEnCurso,
    };

    this.firebaseService
      .guardarEstadoPartido('partidoActual', estado)
      .then(() => console.log('✅ Estado guardado en Firebase'))
      .catch((error) =>
        console.error('❌ Error al guardar en Firebase', error)
      );
  }

  cargarEstado(): Promise<boolean> {
    return this.firebaseService.obtenerEstadoPartido(this.partidoId)
      .then(snapshot => {
        if (!snapshot.exists()) return false;
  
        const estado = snapshot.val();
  
        this.jugadorService.setJugadores(
          (estado.jugadores || []).map((j: any, i: number) => ({
            id: j.id ?? i + 1,
            nombre: j.nombre,
            dorsal: j.dorsal,
            foto: j.foto || '',
            enCampo: j.enCampo || false,
            minutosJugados: j.minutosJugados || 0
          }))
        );
  
        this.cronometroSegundos = estado.cronometroSegundos || 0;
        this.fechaInicio = estado.fechaInicio || null;
        this.partidoEnCurso = estado.partidoEnCurso || false;
  
        if (this.partidoEnCurso && this.fechaInicio) {
          const ahora = Date.now();
          const segundosPasados = Math.floor((ahora - this.fechaInicio) / 1000);
          const minutosPasados = Math.floor(segundosPasados / 60);
  
          this.cronometroSegundos += segundosPasados;
  
          this.jugadorService.getJugadores().forEach(j => {
            if (j.enCampo) {
              j.minutosJugados += minutosPasados;
            }
          });
  
          this.fechaInicio = ahora;
          this.iniciarIntervalos();
        }
  
        this.actualizarDisplay();
        return true;
      })
      .catch(error => {
        console.error('❌ Error al cargar desde Firebase', error);
        return false;
      });
  }

  inicializarEscuchaEnTiempoReal() {
    this.firebaseService.escucharEstadoPartido(this.partidoId, (estado) => {
      if (!estado) return;
  
      const eraEnCurso = this.partidoEnCurso;
  
      this.jugadorService.setJugadores = (estado.jugadores || []).map((j: any, i: number) => ({
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
  
      if (!this.partidoEnCurso) {
        clearInterval(this.cronometroInterval);
        clearInterval(this.sumaMinutosInterval);
      } else if (!eraEnCurso && this.partidoEnCurso) {
        this.iniciarIntervalos();
      }
    });
  }

  
}
