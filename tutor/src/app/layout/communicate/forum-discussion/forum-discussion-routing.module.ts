import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForumDiscussionComponent } from './forum-discussion.component';

const routes: Routes = [ {
  path: '', component:  ForumDiscussionComponent 
} ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForumDiscussionRoutingModule { }
