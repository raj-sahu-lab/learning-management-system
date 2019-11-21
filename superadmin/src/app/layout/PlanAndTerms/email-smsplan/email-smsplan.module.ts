import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailSMSPlanRoutingModule } from './email-smsplan-routing.module';
import { EmailSMSPlanComponent } from './email-smsplan.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [EmailSMSPlanComponent],
  imports: [
    FormsModule,
    CommonModule,
    EmailSMSPlanRoutingModule
  ]
})
export class EmailSMSPlanModule { }
