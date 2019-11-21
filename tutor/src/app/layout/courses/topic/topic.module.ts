import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TopicRoutingModule } from './topic-routing.module';

import { FormsModule } from '@angular/forms';
import { TopicComponent } from './topic.component';
import { TooltipModule } from 'ng2-tooltip-directive';

@NgModule({
  declarations: [TopicComponent],
  imports: [
    TooltipModule,
    FormsModule,
    CommonModule,
    TopicRoutingModule
  ]
})
export class TopicModule { }
