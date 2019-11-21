import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SmsStatementRoutingModule } from './sms-statement-routing.module';
import { SmsStatementComponent } from './sms-statement.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SmsStatementComponent],
  imports: [
    FormsModule,
    CommonModule,
    SmsStatementRoutingModule
  ]
})
export class SmsStatementModule { }
