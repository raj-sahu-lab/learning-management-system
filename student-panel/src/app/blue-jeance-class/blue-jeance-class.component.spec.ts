import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlueJeanceClassComponent } from './blue-jeance-class.component';

describe('BlueJeanceClassComponent', () => {
  let component: BlueJeanceClassComponent;
  let fixture: ComponentFixture<BlueJeanceClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlueJeanceClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlueJeanceClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
