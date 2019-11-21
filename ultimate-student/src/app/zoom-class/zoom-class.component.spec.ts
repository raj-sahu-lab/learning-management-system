import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoomClassComponent } from './zoom-class.component';

describe('ZoomClassComponent', () => {
  let component: ZoomClassComponent;
  let fixture: ComponentFixture<ZoomClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZoomClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoomClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
