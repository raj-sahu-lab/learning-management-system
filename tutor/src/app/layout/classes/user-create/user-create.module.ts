import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserCreateRoutingModule } from './user-create-routing.module';
import { UserCreateComponent } from './userCreate.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [UserCreateComponent],
  imports: [
    FormsModule,
    CommonModule,
    UserCreateRoutingModule
  ]
})
export class UserCreateModule { }
