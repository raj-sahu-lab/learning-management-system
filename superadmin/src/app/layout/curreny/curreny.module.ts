import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CurrenyRoutingModule } from './curreny-routing.module';
import { CurrenyComponent } from './curreny.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CurrenyComponent],
  imports: [
    FormsModule,
    CommonModule,
    CurrenyRoutingModule
  ]
})
export class CurrenyModule { }
