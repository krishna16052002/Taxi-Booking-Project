import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RidehistoryinfoComponent } from './ridehistoryinfo.component';

const routes: Routes = [{ path: '', component: RidehistoryinfoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RidehistoryinfoRoutingModule { }
