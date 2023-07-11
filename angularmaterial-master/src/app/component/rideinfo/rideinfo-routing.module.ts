import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RideinfoComponent } from './rideinfo.component';

const routes: Routes = [{ path: '', component: RideinfoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RideinfoRoutingModule { }
