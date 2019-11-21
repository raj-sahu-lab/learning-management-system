import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryCurrencyComponent } from './primary-currency.component';

describe('PrimaryCurrencyComponent', () => {
  let component: PrimaryCurrencyComponent;
  let fixture: ComponentFixture<PrimaryCurrencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimaryCurrencyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimaryCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
