import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForumDiscussionRoutingModule } from './forum-discussion-routing.module';
import { ForumDiscussionComponent } from './forum-discussion.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ForumDiscussionComponent],
  imports: [
    FormsModule,
    CommonModule,
    ForumDiscussionRoutingModule
  ]
})
export class ForumDiscussionModule { }
