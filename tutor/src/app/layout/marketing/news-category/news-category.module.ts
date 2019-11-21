import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewsCategoryRoutingModule } from './news-category-routing.module';
import { NewsCategoryComponent } from './news-category.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [NewsCategoryComponent],
  imports: [
    FormsModule,
    CommonModule,
    NewsCategoryRoutingModule
  ]
})
export class NewsCategoryModule { }
