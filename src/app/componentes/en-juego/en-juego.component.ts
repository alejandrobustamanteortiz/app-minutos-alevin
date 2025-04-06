import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CronometroService } from 'src/app/servicios/cronometro.service';
import { FirebaseService } from 'src/app/servicios/firebase/firebase.service';
import { Jugador } from 'src/app/models/jugador.model';

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
  timestampInicio?: number;

  tiempo$ = this.cronometroService.tiempo$;
  minutos$ = this.cronometroService.minutos$;

  partidoEnCurso: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private cronometroService: CronometroService,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit(): void {
    this.partidoId = this.route.snapshot.paramMap.get('id')!;

  }




}