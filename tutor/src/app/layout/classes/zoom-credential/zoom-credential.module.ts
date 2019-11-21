import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZoomCredentialRoutingModule } from './zoom-credential-routing.module';
import { ZoomCredentialComponent } from './zoom-credential.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ZoomCredentialComponent],
  imports: [
    FormsModule,
    CommonModule,
    ZoomCredentialRoutingModule
  ]
})
export class ZoomCredentialModule { }
