import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimeZoneRoutingModule } from './time-zone-routing.module';
import { TimeZoneComponent } from './time-zone.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [TimeZoneComponent],
  imports: [
    FormsModule,
    CommonModule,
    TimeZoneRoutingModule
  ]
})
export class TimeZoneModule { }
