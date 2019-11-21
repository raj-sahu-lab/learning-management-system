import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationRoutingModule } from './notification-routing.module';

import { FormsModule } from '@angular/forms';
import { NotificationComponent } from './notification.component';

@NgModule({
  declarations: [NotificationComponent],
  imports: [
    FormsModule,
    CommonModule,
    NotificationRoutingModule
  ]
})
export class NotificationModule { }
