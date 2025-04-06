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


}