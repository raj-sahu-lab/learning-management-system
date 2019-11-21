import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TermsconditionComponent } from './termscondition.component';

const routes: Routes = [{
  path: '', component: TermsconditionComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TermsconditionRoutingModule { }
