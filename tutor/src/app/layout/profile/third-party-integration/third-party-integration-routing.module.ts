import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ThirdPartyIntegrationComponent } from './third-party-integration.component';

const routes: Routes = [ {
  path: '',
  component: ThirdPartyIntegrationComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThirdPartyIntegrationRoutingModule { }
