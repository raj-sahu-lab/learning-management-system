import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportrequestComponent } from './supportrequest.component';

describe('SupportrequestComponent', () => {
  let component: SupportrequestComponent;
  let fixture: ComponentFixture<SupportrequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportrequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
