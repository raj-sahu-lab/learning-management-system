import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LearnerRoutingModule } from './learner-routing.module';

import { LearnerComponent } from './learner.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [LearnerComponent],
  imports: [
    FormsModule,
    CommonModule,
    LearnerRoutingModule
  ]
})
export class LearnerModule { }
