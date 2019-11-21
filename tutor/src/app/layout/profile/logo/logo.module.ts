import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LogoRoutingModule } from './logo-routing.module';
import { LogoComponent } from './logo.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [LogoComponent],
  imports: [
    FormsModule,
    CommonModule,
    LogoRoutingModule
  ]
})
export class LogoModule { }
