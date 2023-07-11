import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriversRoutingModule } from './drivers-routing.module';
import { DriversComponent } from './drivers.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material-module';
import { DrivermodelModule } from '../drivermodel/drivermodel.module';


@NgModule({
  declarations: [
    DriversComponent
  ],
  imports: [
    CommonModule,
    DriversRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    DrivermodelModule
  ]
})
export class DriversModule { }
