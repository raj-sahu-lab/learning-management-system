import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SmsHistoryRoutingModule } from './sms-history-routing.module';
import { SmsHistoryComponent } from './sms-history.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SmsHistoryComponent],
  imports: [
    FormsModule,
    CommonModule,
    SmsHistoryRoutingModule
  ]
})
export class SmsHistoryModule { }
