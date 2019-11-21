import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentClassStartZoomComponent } from './student-class-start-zoom.component';

const routes: Routes = [ {
  path: '', component:  StudentClassStartZoomComponent 
} ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentClassStartZoomRoutingModule { }
