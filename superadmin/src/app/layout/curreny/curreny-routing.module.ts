import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CurrenyComponent } from './curreny.component';

const routes: Routes = [
  {
      path: '', component: CurrenyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CurrenyRoutingModule { }
