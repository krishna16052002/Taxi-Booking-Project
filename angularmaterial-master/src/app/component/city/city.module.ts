import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CityRoutingModule } from './city-routing.module';
import { CityComponent } from './city.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material-module';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    CityComponent
  ],
  imports: [
    CommonModule,
    CityRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    NgxPaginationModule
  ]
})
export class CityModule { }
