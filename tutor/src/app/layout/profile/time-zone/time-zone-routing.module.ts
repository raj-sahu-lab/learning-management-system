import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimeZoneComponent } from './time-zone.component';

const routes: Routes = [ {
  path: '',
  component: TimeZoneComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimeZoneRoutingModule { }
