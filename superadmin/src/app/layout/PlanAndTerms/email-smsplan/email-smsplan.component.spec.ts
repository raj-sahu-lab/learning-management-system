import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailSMSPlanComponent } from './email-smsplan.component';

describe('EmailSMSPlanComponent', () => {
  let component: EmailSMSPlanComponent;
  let fixture: ComponentFixture<EmailSMSPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailSMSPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailSMSPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
