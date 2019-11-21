import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SmsStatementComponent } from './sms-statement.component';

const routes: Routes = [{
  path: '', 
  component:  SmsStatementComponent 
}]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmsStatementRoutingModule { }
