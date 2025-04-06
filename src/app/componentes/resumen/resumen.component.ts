import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../servicios/firebase/firebase.service';
import { Partido } from '../../models/partido.model';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.css']
})
export class ResumenComponent implements OnInit {
  partidos: Partido[] = [];

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
   
  }
}

