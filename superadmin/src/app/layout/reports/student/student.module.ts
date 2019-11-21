import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRoutingModule } from './student-routing.module';
import { StudentComponent } from './student.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [StudentComponent],
  imports: [
    FormsModule,
    CommonModule,
    StudentRoutingModule
  ]
})
export class StudentModule { }
