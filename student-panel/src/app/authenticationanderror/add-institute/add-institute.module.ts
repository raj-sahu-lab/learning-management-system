import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddInstituteRoutingModule } from './add-institute-routing.module';
import { AddInstituteComponent } from './addInstitute.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AddInstituteComponent],
  imports: [
    FormsModule,
    CommonModule,
    AddInstituteRoutingModule
  ]
})
export class AddInstituteModule { }
