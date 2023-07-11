import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenubarRoutingModule } from './menubar-routing.module';
import { MenubarComponent } from './menubar.component';
import { MaterialModule } from 'src/app/material-module';


@NgModule({
  declarations: [
    MenubarComponent
  ],
  imports: [
    CommonModule,
    MenubarRoutingModule,
    MaterialModule,
  ]
})
export class MenubarModule { }
