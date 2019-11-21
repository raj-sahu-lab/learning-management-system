import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubjectRoutingModule } from './subject-routing.module';
import { SubjectComponent } from './subject.component';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'ng2-tooltip-directive';

@NgModule({
  declarations: [SubjectComponent],
  imports: [
    TooltipModule,
    FormsModule,
    CommonModule,
    SubjectRoutingModule
  ]
})
export class SubjectModule { }
