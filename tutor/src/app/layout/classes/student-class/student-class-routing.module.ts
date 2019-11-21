import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentClassComponent } from './student-class.component';

const routes: Routes = [ {
  path: '', component:  StudentClassComponent 
} ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentClassRoutingModule { }
