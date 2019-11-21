import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForumTopicComponent } from './forumTopic.component';

const routes: Routes = [ {
  path: '', component:  ForumTopicComponent 
} ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForumTopicRoutingModule { }
