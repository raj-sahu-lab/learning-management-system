import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForumArticlesRoutingModule } from './forum-articles-routing.module';
import { ForumArticlesComponent } from './forumArticles.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ForumArticlesComponent],
  imports: [
    FormsModule,
    CommonModule,
    ForumArticlesRoutingModule
  ]
})
export class ForumArticlesModule { }
