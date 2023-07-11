import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RideinfoRoutingModule } from './rideinfo-routing.module';
import { RideinfoComponent } from './rideinfo.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material-module';


@NgModule({
  declarations: [
    RideinfoComponent
  ],
  imports: [
    CommonModule,
    RideinfoRoutingModule,
    MatDialogModule,
    MaterialModule
  ]
})
export class RideinfoModule { }

