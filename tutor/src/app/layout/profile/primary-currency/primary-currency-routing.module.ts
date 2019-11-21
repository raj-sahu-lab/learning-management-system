import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrimaryCurrencyComponent } from './primary-currency.component';

const routes: Routes = [{
  path:'',
  component:PrimaryCurrencyComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrimaryCurrencyRoutingModule { }
