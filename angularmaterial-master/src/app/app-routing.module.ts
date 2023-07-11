import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InputComponent } from './input/input.component';


import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';

import { AuthenticationGuard } from './shared/authentication.guard';



const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  // {
  //   path: 'pages',
  //   loadChildren: () => import('./component/components.module')
  //     .then(m => m.ComponentsModule),
  // },
  {
    path: 'menubar',
    // component: MenubarComponent,
    canActivate: [AuthenticationGuard],
    canActivateChild: [AuthenticationGuard],
    loadChildren: () => import('./component/menubar/menubar.module').then(m => m.MenubarModule)
    // children: [
    //   // { path: 'card', component: CardComponent },
    //   { path: 'form', component: FormdesignComponent },
    //   // { path:'input' , component: InputComponent},
    //   // { path: 'table', component: TableComponent },
    //   { path: 'vehicletype', component: VehicleTypeComponent },
    //   { path:'country' , component: CountryComponent},
    //   { path:'city' , component: CityComponent},
    //   { path:'user' , component: UserComponent},
    //   { path:'vehiclepricing' , component: VehiclepricingComponent},
    //   { path:'drivers' , component:DriversComponent},
    //   { path : 'settings' , component:SettingsComponent},
    //   { path:'createride' , component:CreateridesComponent},
      // { path: 'confirm-ride', loadChildren: () => import('./component/confirm-ride/confirm-ride.module').then(m => m.ConfirmRideModule) },
    // ],
  },
  // {
  //   path: 'home',
  //   component: HomeComponent,
  //   canActivate: [AuthenticationGuard],
  // },

  { path: 'input', component: InputComponent },
  // {path:'card',component:CardComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
