import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NormalChatComponent } from './normal-chat.component';


const routes: Routes = [ {
  path: '', component:  NormalChatComponent 
} ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NormalChatRoutingModule { }
