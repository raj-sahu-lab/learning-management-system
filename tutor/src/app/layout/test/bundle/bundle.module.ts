import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BundleRoutingModule } from './bundle-routing.module';
import { BundleComponent } from './bundle.component';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'ng2-tooltip-directive';

@NgModule({
  declarations: [BundleComponent],
  imports: [
    TooltipModule,
    FormsModule,
    CommonModule,
    BundleRoutingModule
  ]
})
export class BundleModule { }
