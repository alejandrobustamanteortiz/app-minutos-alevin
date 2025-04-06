import { TestBed } from '@angular/core/testing';

import { PartidosFirebaseService } from './partidos.firebase.service';

describe('PartidosFirebaseService', () => {
  let service: PartidosFirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartidosFirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
