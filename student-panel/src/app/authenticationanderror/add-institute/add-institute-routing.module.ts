import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddInstituteComponent } from './addInstitute.component';

const routes: Routes = [{
  path: '',
  component: AddInstituteComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddInstituteRoutingModule { }
