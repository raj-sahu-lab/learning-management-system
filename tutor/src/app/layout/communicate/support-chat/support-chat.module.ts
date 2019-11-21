import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupportChatRoutingModule } from './support-chat-routing.module';
import { SupportChatComponent } from './support-chat.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SupportChatComponent],
  imports: [
    FormsModule,
    CommonModule,
    SupportChatRoutingModule
  ]
})
export class SupportChatModule { }
