import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PracticeRoutingModule } from './practice-routing.module';

import { PracticeComponent } from './practice.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [PracticeComponent],
  imports: [
    FormsModule,
    CommonModule,
    PracticeRoutingModule
  ]
})
export class PracticeModule { }
