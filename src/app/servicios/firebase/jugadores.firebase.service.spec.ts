import { TestBed } from '@angular/core/testing';

import { JugadoresFirebaseService } from './jugadores.firebase.service';

describe('JugadoresFirebaseService', () => {
  let service: JugadoresFirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JugadoresFirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
