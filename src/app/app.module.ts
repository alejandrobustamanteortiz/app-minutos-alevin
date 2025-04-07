// app.module.ts
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

// ✅ Firebase moderno
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { environment } from '../environments/environment';
import { CrearPartidoComponent } from './componentes/crear-partido/crear-partido.component';
import { PartidosComponent } from './componentes/partidos/partidos.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JugadorComponent } from './componentes/jugador/jugador.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { EnJuegoComponent } from './componentes/en-juego/en-juego.component';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { AlineacionComponent } from './componentes/alineacion/alineacion.component';

@NgModule({
  declarations: [
    AppComponent,
    JugadoresComponent,
    PartidoComponent,
    ResumenComponent,
    CrearPartidoComponent,
    PartidosComponent,
    JugadorComponent,
    EnJuegoComponent,
    InicioComponent,
    AlineacionComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule ,
    MatNativeDateModule,
    MatListModule,
    MatDatepickerModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatMenuModule,
    MatButtonModule,
    MatCheckboxModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideDatabase(() => getDatabase()),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
