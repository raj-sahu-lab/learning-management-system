import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CouponRoutingModule } from './coupon-routing.module';

import { FormsModule } from '@angular/forms';
import { CouponComponent } from './coupon.component';

@NgModule({
  declarations: [CouponComponent],
  imports: [
    FormsModule,
    CommonModule,
    CouponRoutingModule
  ]
})
export class CouponModule { }
