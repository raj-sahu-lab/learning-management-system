import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SmsComponent } from './sms.component';

const routes: Routes = [ {
    path: '', component:  SmsComponent
} ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmsRoutingModule { }