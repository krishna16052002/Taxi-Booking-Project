import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssigndriverComponent } from './assigndriver.component';

const routes: Routes = [{ path: '', component: AssigndriverComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssigndriverRoutingModule { }
