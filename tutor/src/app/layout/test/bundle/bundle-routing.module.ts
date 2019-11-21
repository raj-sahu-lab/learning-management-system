import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BundleComponent } from './bundle.component';

const routes: Routes = [ {
  path: '', component:  BundleComponent 
} ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BundleRoutingModule { }
