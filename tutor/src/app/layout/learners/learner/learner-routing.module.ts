import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LearnerComponent } from './learner.component';

const routes: Routes = [ {
    path: '', component: LearnerComponent
  } ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LearnerRoutingModule { }
