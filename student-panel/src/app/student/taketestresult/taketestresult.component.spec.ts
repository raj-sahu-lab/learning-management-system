import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaketestresultComponent } from './taketestresult.component';

describe('TaketestresultComponent', () => {
  let component: TaketestresultComponent;
  let fixture: ComponentFixture<TaketestresultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaketestresultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaketestresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
