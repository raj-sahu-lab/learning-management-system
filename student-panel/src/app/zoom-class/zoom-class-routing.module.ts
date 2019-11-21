import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ZoomClassComponent } from './zoom-class.component';

const routes: Routes = [
    {
      path: '' , component: ZoomClassComponent,
    },
  ];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class ZoomClassRoutingModule { }