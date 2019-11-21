import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SetComponent } from './set.component';

const routes: Routes = [ {
  path: '',
  component:  SetComponent 
} ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetRoutingModule { }