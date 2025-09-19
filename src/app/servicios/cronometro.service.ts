import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase/firebase.service';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { Jugador } from '../models/jugador.model';

@Injectable({
  providedIn: 'root'
})
export class CronometroService {

  private tiempoInicio!: number;
  private cronometroSub?: Subscription;
  private segundos = 0;

  private tiempoSubject = new BehaviorSubject<string>('00:00');
  tiempo$ = this.tiempoSubject.asObservable();

  private minutos: { [id: string]: number } = {};
  private minutosSubject = new BehaviorSubject<{ [id: string]: number }>({});
  minutos$ = this.minutosSubject.asObservable();

  private titulares: Jugador[] = [];
  private partidoId!: string;

  constructor(private fb: FirebaseService) {}

  // 👉 Iniciar cronómetro
  iniciar() {
    if (this.cronometroSub) return; // ya está corriendo

    this.tiempoInicio = Date.now() - this.segundos * 1000; // conservar tiempo si estaba pausado

    this.cronometroSub = interval(1000).subscribe(() => {
      this.segundos = Math.floor((Date.now() - this.tiempoInicio) / 1000);

      const minutos = Math.floor(this.segundos / 60);
      const segundos = this.segundos % 60;

      const tiempoFormateado = 
        `${this.pad(minutos)}:${this.pad(segundos)}`;

      this.tiempoSubject.next(tiempoFormateado);
    });
  }

  iniciarCrono(partidoId: string, titulares: Jugador[]) {
  this.partidoId = partidoId;
  this.titulares = titulares;

  this.tiempoInicio = Date.now();
  this.segundos = 0;

  // Cada segundo actualizamos
  this.cronometroSub = interval(1000).subscribe(() => {
    this.segundos++;

    // Formatear tiempo total
    const minutosTotales = Math.floor(this.segundos / 60);
    const segundosRestantes = this.segundos % 60;
    this.tiempoSubject.next(
      `${String(minutosTotales).padStart(2, '0')}:${String(segundosRestantes).padStart(2, '0')}`
    );

    // Sumar minutos jugados a cada titular cada 60s
    if (this.segundos % 60 === 0) {
      this.titulares.forEach(j => {
        this.minutos[j.id!] = (this.minutos[j.id!] || 0) + 1;
      });

      // Emitir los minutos actualizados
      this.minutosSubject.next({ ...this.minutos });
    }
  });
}

detenerCrono() {
  this.cronometroSub?.unsubscribe();
  this.cronometroSub = undefined;
}

actualizarTitulares(titulares: Jugador[]) {
  this.titulares = titulares;
}



  // 👉 Pausar cronómetro
  pausar() {
    this.cronometroSub?.unsubscribe();
    this.cronometroSub = undefined;
  }

  // 👉 Reiniciar cronómetro
  reiniciar() {
    this.pausar();
    this.segundos = 0;
    this.tiempoSubject.next('00:00');
  }

  private pad(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }
}
