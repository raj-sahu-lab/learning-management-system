import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NormalChatRoutingModule } from './normal-chat-routing.module';
import { NormalChatComponent } from './normal-chat.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [NormalChatComponent],
  imports: [
    FormsModule,
    CommonModule,
    NormalChatRoutingModule
  ]
})
export class NormalChatModule { }
