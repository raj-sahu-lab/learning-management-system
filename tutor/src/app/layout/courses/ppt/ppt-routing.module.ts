import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PptComponent } from './ppt.component';

const routes: Routes = [ {
      path: '', component:  PptComponent 
  } ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PptRoutingModule { }
