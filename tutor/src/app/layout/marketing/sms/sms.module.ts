import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SmsRoutingModule } from './sms-routing.module';

import { FormsModule } from '@angular/forms';
import { SmsComponent } from './sms.component';

@NgModule({
  declarations: [SmsComponent],
  imports: [
    FormsModule,
    CommonModule,
    SmsRoutingModule
  ]
})
export class SmsModule { }
