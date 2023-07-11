import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateRideRoutingModule } from './create-ride-routing.module';
import { CreateRideComponent } from './create-ride.component';
import { MaterialModule } from 'src/app/material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CreateRideComponent
  ],
  imports: [
    CommonModule,
    CreateRideRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule


  ]
})
export class CreateRideModule { }
