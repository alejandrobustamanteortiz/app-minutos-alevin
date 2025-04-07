import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlineacionComponent } from './alineacion.component';

describe('AlineacionComponent', () => {
  let component: AlineacionComponent;
  let fixture: ComponentFixture<AlineacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlineacionComponent]
    });
    fixture = TestBed.createComponent(AlineacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
