import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenubarComponent } from './menubar.component';
import { InputComponent } from 'src/app/input/input.component';

const routes: Routes = [
  { path: '', component: MenubarComponent
,children:[
  {
    path: 'confirm-ride',
    loadChildren: () =>
      import('../confirm-ride/confirm-ride.module').then(
        (m) => m.ConfirmRideModule
      ),
  },
  {
    path: 'create-ride',
    loadChildren: () =>
      import('../create-ride/create-ride.module').then(
        (m) => m.CreateRideModule
      ),
  },
  { path: 'drivers', loadChildren: () => import('../drivers/drivers.module').then(m => m.DriversModule) },
  { path: 'drivermodel', loadChildren: () => import('../drivermodel/drivermodel.module').then(m => m.DrivermodelModule) },
  { path: 'city', loadChildren: () => import('../city/city.module').then(m => m.CityModule) },
  { path: 'country', loadChildren: () => import('../country/country.module').then(m => m.CountryModule) },
  { path: 'settings', loadChildren: () => import('../settings/settings.module').then(m => m.SettingsModule) },
  { path: 'user', loadChildren: () => import('../user/user.module').then(m => m.UserModule) },
  { path: 'vehiclepricing', loadChildren: () => import('../vehiclepricing/vehiclepricing.module').then(m => m.VehiclepricingModule) },
  { path: 'vehicle-type', loadChildren: () => import('../vehicle-type/vehicle-type.module').then(m => m.VehicleTypeModule) },
  { path: 'assigndriver', loadChildren: () => import('../assigndriver/assigndriver.module').then(m => m.AssigndriverModule) },
  { path: 'runningrequest', loadChildren: () => import('../runningrequest/runningrequest.module').then(m => m.RunningrequestModule) },

  { path: 'ridehistory', loadChildren: () => import('../ridehistory/ridehistory.module').then(m => m.RidehistoryModule) },
  { path: 'ridehistoryinfo', loadChildren: () => import('../ridehistoryinfo/ridehistoryinfo.module').then(m => m.RidehistoryinfoModule) },
  { path: 'feedback', loadChildren: () => import('../feedback/feedback.module').then(m => m.FeedbackModule) },
   { path:'input' , component: InputComponent},
]},

  // { path: 'rideinfo', loadChildren: () => import('../rideinfo/rideinfo.module').then(m => m.RideinfoModule) },

  // {
  //   path: 'confirm-ride',
  //   loadChildren: () =>
  //     import('../confirm-ride/confirm-ride.module').then(
  //       (m) => m.ConfirmRideModule
  //     ),
  // },
  // {
  //   path: 'create-ride',
  //   loadChildren: () =>
  //     import('../create-ride/create-ride.module').then(
  //       (m) => m.CreateRideModule
  //     ),
  // },
  // { path: 'drivers', loadChildren: () => import('../drivers/drivers.module').then(m => m.DriversModule) },
  // { path: 'drivermodel', loadChildren: () => import('../drivermodel/drivermodel.module').then(m => m.DrivermodelModule) },
  // { path: 'city', loadChildren: () => import('../city/city.module').then(m => m.CityModule) },
  // { path: 'country', loadChildren: () => import('../country/country.module').then(m => m.CountryModule) },
  // { path: 'settings', loadChildren: () => import('../settings/settings.module').then(m => m.SettingsModule) },
  // { path: 'user', loadChildren: () => import('../user/user.module').then(m => m.UserModule) },
  // { path: 'vehiclepricing', loadChildren: () => import('../vehiclepricing/vehiclepricing.module').then(m => m.VehiclepricingModule) },
  // { path: 'vehicle-type', loadChildren: () => import('../vehicle-type/vehicle-type.module').then(m => m.VehicleTypeModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenubarRoutingModule {}
