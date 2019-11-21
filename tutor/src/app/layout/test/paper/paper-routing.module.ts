import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaperComponent } from './paper.component';

const routes: Routes = [ {
  path: '', component:  PaperComponent 
} ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaperRoutingModule { }
