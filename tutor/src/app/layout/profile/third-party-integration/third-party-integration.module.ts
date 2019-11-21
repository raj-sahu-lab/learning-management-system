import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThirdPartyIntegrationRoutingModule } from './third-party-integration-routing.module';
import { ThirdPartyIntegrationComponent } from './third-party-integration.component';

@NgModule({
  declarations: [ThirdPartyIntegrationComponent],
  imports: [
    CommonModule,
    ThirdPartyIntegrationRoutingModule
  ]
})
export class ThirdPartyIntegrationModule { }
