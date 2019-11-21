import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DomainRoutingModule } from './domain-routing.module';
import { DomainComponent } from './domain.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [DomainComponent],
  imports: [
    FormsModule,
    CommonModule,
    DomainRoutingModule
  ]
})
export class DomainModule { }
