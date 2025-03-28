import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JugadoresComponent } from './componentes/jugadores/jugadores.component';
import { PartidoComponent } from './componentes/partido/partido.component';
import { ResumenComponent } from './componentes/resumen/resumen.component';


const routes: Routes = [
  { path: '', redirectTo: 'jugadores', pathMatch: 'full' },
  { path: 'jugadores', component: JugadoresComponent },
  { path: 'partido', component: PartidoComponent },
  { path: 'resumen', component: ResumenComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
