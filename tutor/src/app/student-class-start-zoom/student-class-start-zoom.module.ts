import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentClassStartZoomRoutingModule } from './student-class-start-zoom-routing.module';
import { StudentClassStartZoomComponent } from './student-class-start-zoom.component';

@NgModule({
  declarations: [StudentClassStartZoomComponent],
  imports: [
    StudentClassStartZoomRoutingModule,
    CommonModule,
    StudentClassStartZoomRoutingModule
  ]
})
export class StudentClassStartZoomModule { }
