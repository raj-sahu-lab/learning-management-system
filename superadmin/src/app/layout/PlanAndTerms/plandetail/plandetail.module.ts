import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlandetailRoutingModule } from './plandetail-routing.module';
import { PlandetailComponent } from './plandetail.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [PlandetailComponent],
  imports: [
    FormsModule,
    CommonModule,
    PlandetailRoutingModule
  ]
})
export class PlandetailModule { }
