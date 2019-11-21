import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutusRoutingModule } from './aboutus-routing.module';
import { AboutusComponent } from './aboutus.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AboutusComponent],
  imports: [
    FormsModule,
    CommonModule,
    AboutusRoutingModule
  ]
})
export class AboutusModule { }
