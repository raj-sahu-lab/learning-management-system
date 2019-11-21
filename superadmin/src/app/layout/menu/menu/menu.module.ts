import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuRoutingModule } from './menu-routing.module';
import { MenuComponent } from './menu.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [MenuComponent],
  imports: [
    FormsModule,
    CommonModule,
    MenuRoutingModule
  ]
})
export class MenuModule { }
