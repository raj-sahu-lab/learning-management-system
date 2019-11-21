import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AudioRoutingModule } from './audio-routing.module';
import { AudioComponent } from './audio.component';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'ng2-tooltip-directive';

@NgModule({
  declarations: [AudioComponent],
  imports: [
    TooltipModule,
    FormsModule,
    CommonModule,
    AudioRoutingModule
  ]
})
export class AudioModule { }
