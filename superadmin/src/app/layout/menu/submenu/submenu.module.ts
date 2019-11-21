import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubmenuRoutingModule } from './submenu-routing.module';
import { SubmenuComponent } from './submenu.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SubmenuComponent],
  imports: [
    FormsModule,
    CommonModule,
    SubmenuRoutingModule
  ]
})
export class SubmenuModule { }
