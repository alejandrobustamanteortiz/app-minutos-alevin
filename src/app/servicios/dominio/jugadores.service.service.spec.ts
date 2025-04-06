import { TestBed } from '@angular/core/testing';

import { JugadoresServiceService } from './jugadores.service.service';

describe('JugadoresServiceService', () => {
  let service: JugadoresServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JugadoresServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
