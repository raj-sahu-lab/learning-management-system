import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResultsRoutingModule } from './results-routing.module';
import { ResultsComponent } from './results.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ResultsComponent],
  imports: [
    FormsModule,
    CommonModule,
    ResultsRoutingModule
  ]
})
export class ResultsModule { }
