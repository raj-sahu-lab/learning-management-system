import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgetPasswordRoutingModule } from './forget-password-routing.module';

import { ForgetPasswordComponent } from './forget-password.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ForgetPasswordComponent],
  imports: [
    FormsModule,
    CommonModule,
    ForgetPasswordRoutingModule
  ]
})

export class ForgetPasswordModule { }
