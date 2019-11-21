import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfferRoutingModule } from './offer-routing.module';
import { FormsModule } from '@angular/forms';
import { OfferComponent } from './offer.component';

@NgModule({
  declarations: [OfferComponent],
  imports: [
    FormsModule,
    CommonModule,
    OfferRoutingModule
  ]
})
export class OfferModule { }
