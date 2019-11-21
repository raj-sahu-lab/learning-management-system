import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForumCategoryRoutingModule } from './forum-category-routing.module';
import { ForumCategoryComponent } from './forumCategory.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ForumCategoryComponent],
  imports: [
    FormsModule,
    CommonModule,
    ForumCategoryRoutingModule
  ]
})
export class ForumCategoryModule { }
