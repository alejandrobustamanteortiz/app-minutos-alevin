import { TestBed } from '@angular/core/testing';

import { FormacionFirebaseService } from './formacion.firebase.service';

describe('FormacionFirebaseService', () => {
  let service: FormacionFirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormacionFirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
