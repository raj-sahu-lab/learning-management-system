import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeesRoutingModule } from './fees-routing.module';
import { FeesComponent } from './fees.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [FeesComponent],
  imports: [
    FormsModule,
    CommonModule,
    FeesRoutingModule
  ]
})
export class FeesModule { }
