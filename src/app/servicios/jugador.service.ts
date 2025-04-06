import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Jugador } from '../models/jugador.model';
import { FirebaseService } from './firebase/firebase.service';

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

 
}
