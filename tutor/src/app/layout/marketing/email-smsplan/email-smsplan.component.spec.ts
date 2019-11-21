import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailSMSplanComponent } from './email-smsplan.component';

describe('EmailSMSplanComponent', () => {
  let component: EmailSMSplanComponent;
  let fixture: ComponentFixture<EmailSMSplanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailSMSplanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailSMSplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
