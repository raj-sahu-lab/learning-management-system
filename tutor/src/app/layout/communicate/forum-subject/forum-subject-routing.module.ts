import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForumSubjectComponent } from './forumSubject.component';

const routes: Routes = [ {
  path: '', component:  ForumSubjectComponent 
} ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForumSubjectRoutingModule { }
