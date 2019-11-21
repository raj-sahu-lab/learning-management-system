import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlueJeanceClassComponent } from './blue-jeance-class.component';
import { BlueJeanceClassRoutingModule } from './blue-jeance-class-routing.module';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [BlueJeanceClassComponent],
  imports: [
    CommonModule,
    BlueJeanceClassRoutingModule,
    ToastrModule.forRoot()
  ]
})
export class BlueJeanceClassModule { }
