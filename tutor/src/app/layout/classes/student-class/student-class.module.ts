import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentClassRoutingModule } from './student-class-routing.module';
import { StudentClassComponent } from './student-class.component';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'ng2-tooltip-directive';

import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

@NgModule({
  declarations: [StudentClassComponent],
  imports: [
    TooltipModule ,
    FormsModule,
    CommonModule,
    StudentClassRoutingModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ]
})
export class StudentClassModule { }
