import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DrivermodelRoutingModule } from './drivermodel-routing.module';
import { DrivermodelComponent } from './drivermodel.component';
import { MaterialModule } from 'src/app/material-module';
import {  MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    DrivermodelComponent
  ],
  imports: [
    CommonModule,
    DrivermodelRoutingModule,
    MaterialModule,
    MatDialogModule
  ]
})
export class DrivermodelModule { }
