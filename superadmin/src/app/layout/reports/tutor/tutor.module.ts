import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TutorComponent } from './tutor.component';

import { TutorRoutingModule } from './tutor-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [TutorComponent],
  imports: [
    FormsModule,
    CommonModule,
    TutorRoutingModule
  ]
})
export class TutorModule { }
