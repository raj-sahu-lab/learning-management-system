import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ZoomCredentialComponent } from './zoom-credential.component';

const routes: Routes = [ {
  path: '', component:  ZoomCredentialComponent 
} ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ZoomCredentialRoutingModule { }
