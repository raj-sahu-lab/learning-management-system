import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotpasswordRoutingModule } from './forgotpassword-routing.module';

import { ForgotpasswordComponent } from './forgotpassword.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ForgotpasswordComponent],
  imports: [
    FormsModule,
    CommonModule,
    ForgotpasswordRoutingModule
  ]
})
export class ForgotpasswordModule { }
