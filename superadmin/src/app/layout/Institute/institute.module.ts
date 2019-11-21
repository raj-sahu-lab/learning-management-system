import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstituteRoutingModule } from './institute-routing.module';
import { InstituteComponent } from './institute.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [InstituteComponent],
  imports: [
    FormsModule,
    CommonModule,
    InstituteRoutingModule
  ]
})
export class InstituteModule { }
