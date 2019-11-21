import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SetRoutingModule } from './set-routing.module';
import { SetComponent } from './set.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SetComponent],
  imports: [
    FormsModule,
    CommonModule,
    SetRoutingModule
  ]
})
export class SetModule { }
