import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SmsRoutingModule } from './sms-routing.module';
import { SmsComponent } from './sms.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SmsComponent],
  imports: [
    FormsModule,
    CommonModule,
    SmsRoutingModule
  ]
})
export class SmsModule { }
