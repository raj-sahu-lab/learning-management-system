import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailTemplateRoutingModule } from './email-template-routing.module';
import { EmailTemplateComponent } from './email-template.component';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [EmailTemplateComponent],
  imports: [
    FormsModule,
    CommonModule,
    EmailTemplateRoutingModule
  ]
})
export class EmailTemplateModule { }
