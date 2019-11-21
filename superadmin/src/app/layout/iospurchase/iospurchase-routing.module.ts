import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IospurchaseComponent } from './iospurchase.component';

const routes: Routes = [ {
  path: '',
  component:  IospurchaseComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IOSPurchaseRoutingModule { }
