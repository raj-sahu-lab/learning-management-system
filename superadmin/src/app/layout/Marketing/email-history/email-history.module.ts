import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailHistoryRoutingModule } from './email-history-routing.module';
import { EmailHistoryComponent } from './email-history.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [EmailHistoryComponent],
  imports: [
    FormsModule,
    CommonModule,
    EmailHistoryRoutingModule
  ]
})
export class EmailHistoryModule { }
