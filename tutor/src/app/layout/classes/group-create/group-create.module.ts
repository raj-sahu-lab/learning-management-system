import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupCreateRoutingModule } from './group-create-routing.module';
import { GroupCreateComponent } from './group-create.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [GroupCreateComponent],
  imports: [
    FormsModule,
    CommonModule,
    GroupCreateRoutingModule
  ]
})
export class GroupCreateModule { }
