import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoRoutingModule } from './video-routing.module';
import { VideoComponent } from './video.component';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'ng2-tooltip-directive';

@NgModule({
  declarations: [VideoComponent],
  imports: [
    TooltipModule,
    FormsModule,
    CommonModule,
    VideoRoutingModule
  ]
})
export class VideoModule { }
