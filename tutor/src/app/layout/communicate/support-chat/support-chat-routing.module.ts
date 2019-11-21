import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupportChatComponent } from './support-chat.component';

const routes: Routes = [ {
  path: '', component:  SupportChatComponent 
} ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupportChatRoutingModule { }
