import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailRoutingModule } from './email-routing.module';
import { EmailComponent } from './email.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [EmailComponent],
  imports: [
    FormsModule,
    CommonModule,
    EmailRoutingModule
  ]
})
export class EmailModule { }
