import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrimaryCurrencyRoutingModule } from './primary-currency-routing.module';
import { PrimaryCurrencyComponent } from './primary-currency.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [PrimaryCurrencyComponent],
  imports: [
    FormsModule,
    CommonModule,
    PrimaryCurrencyRoutingModule
  ]
})
export class PrimaryCurrencyModule { }
