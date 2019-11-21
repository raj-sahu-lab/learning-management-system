import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaperRoutingModule } from './paper-routing.module';
import { PaperComponent } from './paper.component';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'ng2-tooltip-directive';

@NgModule({
  declarations: [PaperComponent],
  imports: [
    TooltipModule,
    FormsModule,
    CommonModule,
    PaperRoutingModule
  ]
})
export class PaperModule { }
