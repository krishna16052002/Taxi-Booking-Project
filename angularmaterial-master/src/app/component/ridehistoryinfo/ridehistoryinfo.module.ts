import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RidehistoryinfoRoutingModule } from './ridehistoryinfo-routing.module';
import { RidehistoryinfoComponent } from './ridehistoryinfo.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material-module';


@NgModule({
  declarations: [
    RidehistoryinfoComponent
  ],
  imports: [
    CommonModule,
    RidehistoryinfoRoutingModule,
    MatDialogModule,
    MaterialModule
  ]
})
export class RidehistoryinfoModule { }
