import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivacypoliciesRoutingModule } from './privacypolicies-routing.module';
import { PrivacypoliciesComponent } from './privacypolicies.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [PrivacypoliciesComponent],
  imports: [
    FormsModule,
    CommonModule,
    PrivacypoliciesRoutingModule
  ]
})
export class PrivacypoliciesModule { }
