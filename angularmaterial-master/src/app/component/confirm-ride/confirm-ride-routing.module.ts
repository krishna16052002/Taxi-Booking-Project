import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmRideComponent } from './confirm-ride.component';

const routes: Routes = [{ path: '', component: ConfirmRideComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfirmRideRoutingModule { }
