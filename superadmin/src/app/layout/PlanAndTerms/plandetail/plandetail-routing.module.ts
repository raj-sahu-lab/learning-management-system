import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlandetailComponent } from './plandetail.component';

const routes: Routes = [ {
  path: '', 
  component:  PlandetailComponent 
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlandetailRoutingModule { }
