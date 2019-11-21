import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SmsSendComponent } from './sms-send.component';

const routes: Routes = [ {
  path: '', 
  component:  SmsSendComponent 
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmsSendRoutingModule { }
