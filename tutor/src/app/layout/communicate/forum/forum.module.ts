import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForumRoutingModule } from './forum-routing.module';
import { ForumComponent } from './forum.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ForumComponent],
  imports: [
    FormsModule,
    CommonModule,
    ForumRoutingModule
  ]
})
export class ForumModule { }
