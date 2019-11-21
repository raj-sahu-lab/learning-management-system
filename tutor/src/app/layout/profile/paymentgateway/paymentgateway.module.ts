import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentgatewayRoutingModule } from './paymentgateway-routing.module';
import { PaymentgatewayComponent } from './paymentgateway.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [PaymentgatewayComponent],
  imports: [
    FormsModule,
    CommonModule,
    PaymentgatewayRoutingModule
  ]
})
export class PaymentgatewayModule { }
