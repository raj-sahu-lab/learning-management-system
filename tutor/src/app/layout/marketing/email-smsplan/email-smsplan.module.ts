import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailSMSplanRoutingModule } from './email-smsplan-routing.module';
import { EmailSMSplanComponent } from './email-smsplan.component';
import { FormsModule } from '@angular/forms';
import { NgxPayPalModule } from 'ngx-paypal';

@NgModule({
  declarations: [EmailSMSplanComponent],
  imports: [
    FormsModule,
    CommonModule,
    EmailSMSplanRoutingModule,
    NgxPayPalModule
  ]
})
export class EmailSMSplanModule { }
