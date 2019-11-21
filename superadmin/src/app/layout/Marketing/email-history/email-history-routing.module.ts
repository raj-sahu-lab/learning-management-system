import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmailHistoryComponent } from './email-history.component';

const routes: Routes = [ {
  path: '', 
  component:  EmailHistoryComponent 
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailHistoryRoutingModule { }
