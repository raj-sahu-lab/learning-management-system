import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForumTopicRoutingModule } from './forum-topic-routing.module';
import { ForumTopicComponent } from './forumTopic.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ForumTopicComponent],
  imports: [
    FormsModule,
    CommonModule,
    ForumTopicRoutingModule
  ]
})
export class ForumTopicModule { }
