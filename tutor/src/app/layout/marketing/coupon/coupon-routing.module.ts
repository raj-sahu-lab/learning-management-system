import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CouponComponent } from './coupon.component';

const routes: Routes = [ {
  path: '', component:  CouponComponent
} ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CouponRoutingModule { }
