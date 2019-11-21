import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TermsconditionRoutingModule } from './termscondition-routing.module';
import { TermsconditionComponent } from './termscondition.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [TermsconditionComponent],
  imports: [
    FormsModule,
    CommonModule,
    TermsconditionRoutingModule
  ]
})
export class TermsconditionModule { }
