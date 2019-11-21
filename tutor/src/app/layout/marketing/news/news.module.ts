import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewsRoutingModule } from './news-routing.module';

import { FormsModule } from '@angular/forms';
import { NewsComponent } from './news.component';

import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

@NgModule({
  declarations: [NewsComponent],
  imports: [
    FormsModule,
    CommonModule,
    NewsRoutingModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ]
})
export class NewsModule { }
