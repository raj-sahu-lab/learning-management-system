import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TutorRoutingModule } from './tutor-routing.module';

import { TutorComponent } from './tutor.component';
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
