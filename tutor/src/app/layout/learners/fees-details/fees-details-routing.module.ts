import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FeesDetailsComponent } from './feesDetails.component';

const routes: Routes = [ {
  path: '', component: FeesDetailsComponent
} ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeesDetailsRoutingModule { }
