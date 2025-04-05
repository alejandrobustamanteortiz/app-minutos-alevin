import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PartidoService } from 'src/app/servicios/partido.service';
import { Jugador } from 'src/app/models/jugador.model';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-en-juego',
  templateUrl: './en-juego.component.html',
  styleUrls: ['./en-juego.component.css']
})
export class EnJuegoComponent implements OnInit, OnDestroy {

  partidoId!: string;
  titulares: Jugador[] = [];
  suplentes: Jugador[] = [];
  rival: string | undefined;
  minutos: { [jugadorId: string]: number } = {};
  tiempo: string = '00:00';
  partidoEnCurso: boolean = false;
  fechaInicio!: Date

  private cronometroSub?: Subscription;
  private segundosTotales: number = 0;

  constructor(
    private route: ActivatedRoute,
    private partidoService: PartidoService
  ) {}

  ngOnInit(): void {
    this.partidoId = this.route.snapshot.paramMap.get('id')!;
    this.cargarPartido();
  }

  cargarPartido(): void {

    this.partidoService.obtenerPartido(this.partidoId).subscribe(partido => {
      const jugadores = partido.jugadoresConvocados || [];
      

      this.titulares = jugadores.filter(j => j.titular === true).slice(0, 8);
      this.suplentes = jugadores.filter(j => !j.titular);
      this.rival = partido.rival
      this.fechaInicio = partido.fechaInicio


      // Inicializar minutos
      this.titulares.forEach(j => this.minutos[j.id!] = 0);
    });
  }

  iniciarPartido(): void {
    if (this.partidoEnCurso) return;

    this.partidoEnCurso = true;
    this.cronometroSub = interval(1000).subscribe(() => {
      this.segundosTotales++;
      this.tiempo = this.formatTiempo(this.segundosTotales);

      // Aumentar minutos a los titulares cada 60 segundos
      if (this.segundosTotales % 60 === 0) {
        this.titulares.forEach(j => {
          this.minutos[j.id!] = (this.minutos[j.id!] || 0) + 1;
        });
      }
    });
  }

  pausarPartido(): void {
    this.partidoEnCurso = false;
    this.cronometroSub?.unsubscribe();
  }

  finalizarPartido(): void {
    this.pausarPartido();
    alert('⛔ Partido finalizado. Puedes guardar los datos si lo deseas.');
    // aquí podrías guardar minutos jugados, cambios, etc.
  }

  formatTiempo(segundos: number): string {
    const m = Math.floor(segundos / 60).toString().padStart(2, '0');
    const s = (segundos % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  sustituir(jugadorSale: Jugador): void {
    const jugadorEntra = this.suplentes.shift();
    if (!jugadorEntra) return;

    // Quitar del campo
    this.titulares = this.titulares.filter(j => j.id !== jugadorSale.id);

    // Meter nuevo
    this.titulares.push(jugadorEntra);

    // El que salió va a suplentes
    this.suplentes.push(jugadorSale);

    // Iniciar conteo de minutos del nuevo
    this.minutos[jugadorEntra.id!] = 0;
  }

  meterAlCampo(jugador: Jugador): void {
    if (this.titulares.length >= 8) {
      alert('Ya hay 8 jugadores en el campo.');
      return;
    }

    this.suplentes = this.suplentes.filter(j => j.id !== jugador.id);
    this.titulares.push(jugador);
    this.minutos[jugador.id!] = 0;
  }

  ngOnDestroy(): void {
    this.cronometroSub?.unsubscribe();
  }
}
