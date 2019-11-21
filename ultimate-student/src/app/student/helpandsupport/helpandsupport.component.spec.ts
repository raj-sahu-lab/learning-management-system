import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpandsupportComponent } from './helpandsupport.component';

describe('HelpandsupportComponent', () => {
  let component: HelpandsupportComponent;
  let fixture: ComponentFixture<HelpandsupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpandsupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpandsupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
