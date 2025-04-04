import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnJuegoComponent } from './en-juego.component';

describe('EnJuegoComponent', () => {
  let component: EnJuegoComponent;
  let fixture: ComponentFixture<EnJuegoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnJuegoComponent]
    });
    fixture = TestBed.createComponent(EnJuegoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
