import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestResultRoutingModule } from './test-result-routing.module';
import { TestResultComponent } from './testResult.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [TestResultComponent],
  imports: [
    FormsModule,
    CommonModule,
    TestResultRoutingModule
  ]
})
export class TestResultModule { }
