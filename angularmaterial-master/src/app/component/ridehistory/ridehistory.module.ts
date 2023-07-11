import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RidehistoryRoutingModule } from './ridehistory-routing.module';
import { RidehistoryComponent } from './ridehistory.component';
import { MaterialModule } from 'src/app/material-module';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    RidehistoryComponent
  ],
  imports: [
    CommonModule,
    RidehistoryRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule


  ]
})
export class RidehistoryModule { }
