import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlueJeanceClassComponent } from './blue-jeance-class.component';

const routes: Routes = [
    {
      path: '' , component: BlueJeanceClassComponent,
    },
  ];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class BlueJeanceClassRoutingModule { }