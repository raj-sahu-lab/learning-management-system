import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PdfRoutingModule } from './pdf-routing.module';
import { PdfComponent } from './pdf.component';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'ng2-tooltip-directive';

@NgModule({
  declarations: [PdfComponent],
  imports: [
    TooltipModule,
    FormsModule,
    CommonModule,
    PdfRoutingModule
  ]
})
export class PdfModule { }
