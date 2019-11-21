import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReviewsRoutingModule } from './reviews-routing.module';
import { ReviewsComponent } from './reviews.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ReviewsComponent],
  imports: [
    FormsModule,
    CommonModule,
    ReviewsRoutingModule
  ]
})
export class ReviewsModule { }
