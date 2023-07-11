import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfirmRideRoutingModule } from './confirm-ride-routing.module';
import { ConfirmRideComponent } from './confirm-ride.component';
import { MaterialModule } from 'src/app/material-module';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { RideinfoModule } from '../rideinfo/rideinfo.module';



@NgModule({
  declarations: [
    ConfirmRideComponent
  ],
  imports: [
    CommonModule,
    ConfirmRideRoutingModule,
    MaterialModule,
    FormsModule,
    MatTableModule,
    RideinfoModule
  ]
})
export class ConfirmRideModule { }
