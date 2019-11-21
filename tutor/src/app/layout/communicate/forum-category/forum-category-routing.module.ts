import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForumCategoryComponent } from './forumCategory.component';

const routes: Routes = [ {
  path: '', component:  ForumCategoryComponent 
} ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForumCategoryRoutingModule { }
