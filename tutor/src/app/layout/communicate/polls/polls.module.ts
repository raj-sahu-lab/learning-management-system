import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PollsRoutingModule } from './polls-routing.module';
import { PollsComponent } from './polls.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [PollsComponent],
  imports: [
    FormsModule,
    CommonModule,
    PollsRoutingModule
  ]
})
export class PollsModule { }
