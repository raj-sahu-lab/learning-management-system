import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceRoutingModule } from './invoice-routing.module';
import { InvoiceComponent } from './invoice.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [InvoiceComponent],
  imports: [
    FormsModule,
    CommonModule,
    InvoiceRoutingModule
  ]
})
export class InvoiceModule { }
