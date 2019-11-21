import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerifiyRoutingModule } from './verifiy-routing.module';

import { VerifiyComponent } from './verifiy.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [VerifiyComponent],
  imports: [
    FormsModule,
    CommonModule,
    VerifiyRoutingModule
  ]
})
export class VerifiyModule { }
