import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestResultComponent } from './testResult.component';

const routes: Routes = [ {
  path: '',
  component: TestResultComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestResultRoutingModule { }
