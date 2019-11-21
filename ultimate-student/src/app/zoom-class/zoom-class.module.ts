import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZoomClassComponent } from './zoom-class.component';
import { ZoomClassRoutingModule } from './zoom-class-routing.module';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [ZoomClassComponent],
  imports: [
    CommonModule,
    ZoomClassRoutingModule,
    ToastrModule.forRoot()
  ]
})
export class ZoomClassModule { }
