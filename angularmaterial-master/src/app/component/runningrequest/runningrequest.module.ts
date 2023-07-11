import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RunningrequestRoutingModule } from './runningrequest-routing.module';
import { RunningrequestComponent } from './runningrequest.component';
import { MaterialModule } from 'src/app/material-module';


@NgModule({
  declarations: [
    RunningrequestComponent
  ],
  imports: [
    CommonModule,
    RunningrequestRoutingModule,
    MaterialModule
  ]
})
export class RunningrequestModule { }
