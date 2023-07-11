import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehiclepricingComponent } from './vehiclepricing.component';

const routes: Routes = [{ path: '', component: VehiclepricingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehiclepricingRoutingModule { }
