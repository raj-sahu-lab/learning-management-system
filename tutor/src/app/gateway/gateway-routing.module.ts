import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GatewayComponent } from './gateway.component';

const routes: Routes = [{
  path: '', 
  component: GatewayComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GatewayRoutingModule { }
