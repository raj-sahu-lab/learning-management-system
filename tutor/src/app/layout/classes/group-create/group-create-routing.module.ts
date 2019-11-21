import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupCreateComponent } from './group-create.component';

const routes: Routes = [{
  path:'',
  component : GroupCreateComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupCreateRoutingModule { }
