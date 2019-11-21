import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlanPurchaseComponent } from './plan-purchase.component';

const routes: Routes = [
  {
    path: '',
    component: PlanPurchaseComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanPurchaseRoutingModule { }
