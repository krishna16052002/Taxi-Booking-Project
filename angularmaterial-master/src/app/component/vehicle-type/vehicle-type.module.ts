import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehicleTypeRoutingModule } from './vehicle-type-routing.module';
import { VehicleTypeComponent } from './vehicle-type.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material-module';


@NgModule({
  declarations: [
    VehicleTypeComponent
  ],
  imports: [
    CommonModule,
    VehicleTypeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class VehicleTypeModule { }
