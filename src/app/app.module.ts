import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HttpClientModule } from '@angular/common/http';
import { JugadoresComponent } from './componentes/jugadores/jugadores.component';
import { FormsModule } from '@angular/forms';
import { PartidoComponent } from './componentes/partido/partido.component';
import { ResumenComponent } from './componentes/resumen/resumen.component';

@NgModule({
  declarations: [
    AppComponent,
    JugadoresComponent,
    PartidoComponent,
    ResumenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule ,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
