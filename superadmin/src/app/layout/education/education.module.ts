import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EducationRoutingModule } from './education-routing.module';
import { EducationComponent } from './education.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [EducationComponent],
  imports: [
    FormsModule,
    CommonModule,
    EducationRoutingModule
  ]
})
export class EducationModule { }
