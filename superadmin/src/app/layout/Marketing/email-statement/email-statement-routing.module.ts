import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmailStatementComponent } from './email-statement.component';

const routes: Routes = [{
  path: '', 
  component:  EmailStatementComponent 
}]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailStatementRoutingModule { }
