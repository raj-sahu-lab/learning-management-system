import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentRoutingModule } from './content-routing.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ContentComponent } from './content.component';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'ng2-tooltip-directive';

@NgModule({
  declarations: [ContentComponent],
  imports: [
    TooltipModule,
    CKEditorModule,
    FormsModule,
    CommonModule,
    ContentRoutingModule
  ]
})
export class ContentModule { }
