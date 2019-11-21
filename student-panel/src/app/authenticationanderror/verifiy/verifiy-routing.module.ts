import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VerifiyComponent } from './verifiy.component';

const routes: Routes = [{
  path: '', component: VerifiyComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerifiyRoutingModule { }