import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehiclepricingRoutingModule } from './vehiclepricing-routing.module';
import { VehiclepricingComponent } from './vehiclepricing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material-module';


@NgModule({
  declarations: [
    VehiclepricingComponent
  ],
  imports: [
    CommonModule,
    VehiclepricingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class VehiclepricingModule { }
