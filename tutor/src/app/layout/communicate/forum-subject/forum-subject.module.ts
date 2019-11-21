import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForumSubjectRoutingModule } from './forum-subject-routing.module';
import { ForumSubjectComponent } from './forumSubject.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ForumSubjectComponent],
  imports: [
    FormsModule,
    CommonModule,
    ForumSubjectRoutingModule
  ]
})
export class ForumSubjectModule { }
