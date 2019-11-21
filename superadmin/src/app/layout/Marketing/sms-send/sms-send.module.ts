import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SmsSendRoutingModule } from './sms-send-routing.module';
import { SmsSendComponent } from './sms-send.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SmsSendComponent],
  imports: [
    FormsModule,
    CommonModule,
    SmsSendRoutingModule
  ]
})
export class SmsSendModule { }
