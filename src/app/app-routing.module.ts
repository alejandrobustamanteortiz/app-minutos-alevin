import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JugadoresComponent } from './componentes/jugadores/jugadores.component';
import { PartidoComponent } from './componentes/partido/partido.component';
import { ResumenComponent } from './componentes/resumen/resumen.component';
import { PartidosComponent } from './componentes/partidos/partidos.component';
import { CrearPartidoComponent } from './componentes/crear-partido/crear-partido.component';
import { EnJuegoComponent } from './componentes/en-juego/en-juego.component';
import { InicioComponent } from './componentes/inicio/inicio.component';


const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent },
  { path: 'partidos', component: PartidosComponent },
  { path: 'crear', component: CrearPartidoComponent },
  { path: 'partido/:id', component: PartidoComponent },
  { path: 'resumen', component: ResumenComponent },
  { path: 'jugadores', component: JugadoresComponent },
  { path: 'en-juego/:id', component: EnJuegoComponent },
  { path: '**', redirectTo: 'inicio' } // redirección si no encuentra ruta
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
