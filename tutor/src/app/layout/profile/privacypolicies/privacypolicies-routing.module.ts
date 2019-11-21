import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrivacypoliciesComponent } from './privacypolicies.component';

const routes: Routes = [ {
  path: '',
  component: PrivacypoliciesComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivacypoliciesRoutingModule { }
