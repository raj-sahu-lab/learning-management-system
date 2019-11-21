import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IOSPurchaseRoutingModule } from './iospurchase-routing.module';
import { IospurchaseComponent } from './iospurchase.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [IospurchaseComponent],
  imports: [
    FormsModule,
    CommonModule,
    IOSPurchaseRoutingModule
  ]
})
export class IOSPurchaseModule { }
