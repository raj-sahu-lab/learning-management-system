import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeriesRoutingModule } from './series-routing.module';
import { SeriesComponent } from './series.component';
import { FormsModule } from '@angular/forms';
import { KatexModule } from 'ng-katex';

@NgModule({
  declarations: [SeriesComponent],
  imports: [
    FormsModule,
    CommonModule,
    SeriesRoutingModule,
    KatexModule
  ]
})
export class SeriesModule { }
