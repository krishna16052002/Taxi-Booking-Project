import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RunningrequestComponent } from './runningrequest.component';

const routes: Routes = [{ path: '', component: RunningrequestComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RunningrequestRoutingModule { }
