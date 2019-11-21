import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PasswordRoutingModule } from './password-routing.module';
import { PasswordComponent } from './password.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [PasswordComponent],
  imports: [
    FormsModule,
    CommonModule,
    PasswordRoutingModule
  ]
})
export class PasswordModule { }
