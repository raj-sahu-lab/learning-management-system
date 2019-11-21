import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TermRoutingModule } from './term-routing.module';
import { TermComponent } from './term.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [TermComponent],
  imports: [
    FormsModule,
    CommonModule,
    TermRoutingModule
  ]
})
export class TermModule { }
