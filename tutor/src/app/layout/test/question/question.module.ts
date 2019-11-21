import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestionRoutingModule } from './question-routing.module';
import { QuestionComponent } from './question.component';
import { FormsModule } from '@angular/forms';
import { KatexModule } from 'ng-katex';

@NgModule({
  declarations: [QuestionComponent],
  imports: [
    FormsModule,
    CommonModule,
    QuestionRoutingModule,
    KatexModule
  ]
})
export class QuestionModule { }
