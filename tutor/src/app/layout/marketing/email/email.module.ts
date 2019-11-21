import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailRoutingModule } from './email-routing.module';

import { FormsModule } from '@angular/forms';
import { EmailComponent } from './email.component';

@NgModule({
  declarations: [EmailComponent],
  imports: [
    FormsModule,
    CommonModule,
    EmailRoutingModule
  ]
})
export class EmailModule { }
