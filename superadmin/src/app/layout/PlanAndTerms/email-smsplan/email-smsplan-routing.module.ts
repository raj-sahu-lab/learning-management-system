import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmailSMSPlanComponent } from './email-smsplan.component';

const routes: Routes = [ {
  path: '', 
  component:  EmailSMSPlanComponent 
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailSMSPlanRoutingModule { }
