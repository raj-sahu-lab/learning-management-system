import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubmenuComponent } from './submenu.component';

const routes: Routes = [
  {
      path: '', component: SubmenuComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubmenuRoutingModule { }
