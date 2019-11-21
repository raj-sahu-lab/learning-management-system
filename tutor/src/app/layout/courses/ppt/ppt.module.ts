import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PptRoutingModule } from './ppt-routing.module';
import { PptComponent } from './ppt.component';
import { FormsModule } from '@angular/forms';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { TooltipModule } from 'ng2-tooltip-directive';

@NgModule({
  declarations: [PptComponent],
  imports: [
    TooltipModule,
    NgxDocViewerModule,
    FormsModule,
    CommonModule,
    PptRoutingModule
  ]
})
export class PptModule { }
