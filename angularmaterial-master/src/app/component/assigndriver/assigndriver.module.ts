import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssigndriverRoutingModule } from './assigndriver-routing.module';
import { AssigndriverComponent } from './assigndriver.component';
import { MaterialModule } from 'src/app/material-module';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    AssigndriverComponent
  ],
  imports: [
    CommonModule,
    AssigndriverRoutingModule,
    MaterialModule,
    MatDialogModule,
  ]
})
export class AssigndriverModule { }
