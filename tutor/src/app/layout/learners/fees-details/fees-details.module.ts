import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeesDetailsRoutingModule } from './fees-details-routing.module';
import { FeesDetailsComponent } from './feesDetails.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [FeesDetailsComponent],
  imports: [
    FormsModule,
    CommonModule,
    FeesDetailsRoutingModule
  ]
})
export class FeesDetailsModule { }
