import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrivermodelComponent } from './drivermodel.component';

const routes: Routes = [{ path: '', component: DrivermodelComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DrivermodelRoutingModule { }
