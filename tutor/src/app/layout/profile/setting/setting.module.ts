import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingRoutingModule } from './setting-routing.module';
import { SettingComponent } from './setting.component';
import { TooltipModule } from 'ng2-tooltip-directive';

@NgModule({
  declarations: [SettingComponent],
  imports: [
    TooltipModule ,
    CommonModule,
    SettingRoutingModule
  ]
})
export class SettingModule { }