import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmailSMSplanComponent } from './email-smsplan.component';

const routes: Routes = [ {
  path: '', component:  EmailSMSplanComponent
} ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailSMSplanRoutingModule { }
