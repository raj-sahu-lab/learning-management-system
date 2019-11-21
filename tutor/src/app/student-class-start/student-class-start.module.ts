import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentClassStartRoutingModule } from './student-class-start-routing.module';
import { StudentClassStartComponent } from './studentClassStart.component';

@NgModule({
  declarations: [StudentClassStartComponent],
  imports: [
    CommonModule,
    StudentClassStartRoutingModule
  ]
})
export class StudentClassStartModule { }
