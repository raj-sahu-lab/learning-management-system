import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupportRoutingModule } from './support-routing.module';
import { SupportComponent } from './support.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SupportComponent],
  imports: [
    FormsModule,
    CommonModule,
    SupportRoutingModule
  ]
})
export class SupportModule { }
