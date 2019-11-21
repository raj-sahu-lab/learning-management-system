import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlanPurchaseRoutingModule } from './plan-purchase-routing.module';
import { PlanPurchaseComponent } from './plan-purchase.component';
import { NgxPayPalModule } from 'ngx-paypal';

@NgModule({
  declarations: [PlanPurchaseComponent],
  imports: [
    NgxPayPalModule,
    FormsModule,
    CommonModule,
    PlanPurchaseRoutingModule
  ]
})
export class PlanPurchaseModule { }