import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchRoutingModule } from './branch-routing.module';
import { BranchComponent } from './branch.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [BranchComponent],
  imports: [
    FormsModule,
    CommonModule,
    BranchRoutingModule
  ]
})
export class BranchModule { }