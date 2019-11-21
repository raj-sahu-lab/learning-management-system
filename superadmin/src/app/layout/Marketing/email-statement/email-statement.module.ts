import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailStatementRoutingModule } from './email-statement-routing.module';
import { EmailStatementComponent } from './email-statement.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [EmailStatementComponent],
  imports: [
    FormsModule,
    CommonModule,
    EmailStatementRoutingModule
  ]
})
export class EmailStatementModule { }
