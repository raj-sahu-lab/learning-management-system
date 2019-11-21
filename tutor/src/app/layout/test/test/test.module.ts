import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestRoutingModule } from './test-routing.module';

import { TestComponent } from './test.component';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'ng2-tooltip-directive';

@NgModule({
  declarations: [TestComponent],
  imports: [
    TooltipModule,
    FormsModule,
    CommonModule,
    TestRoutingModule
  ]
})
export class TestModule { }
