import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForumArticlesComponent } from './forumArticles.component';

const routes: Routes = [ {
  path: '', component:  ForumArticlesComponent 
} ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForumArticlesRoutingModule { }
