import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-rideinfo',
  templateUrl: './rideinfo.component.html',
  styleUrls: ['./rideinfo.component.css']
})
export class RideinfoComponent {
ridedata: any ;
  vehicle_id: any;
  entries: any[] = [];
  cityData: any;
  usersdata: any;
  vehicledata: any;


constructor( public dialogRef: MatDialogRef<RideinfoComponent> ,  @Inject(MAT_DIALOG_DATA) public data: Ridedata){}
ngOnInit() {
  console.log(this.data);
  this.ridedata = this.data.ridedata;
  console.log(this.ridedata);
  this.entries = Object.entries(this.ridedata);
  this.cityData = this.ridedata.citydata;
  console.log(this.cityData);
  this.usersdata = this.ridedata.usersdata;
  console.log(this.usersdata);
  this.vehicledata = this.ridedata.vehicledata;
  console.log(this.vehicledata);
}
closeDialog(): void {
  this.dialogRef.close();
}


}
export interface Ridedata {
  ridedata: String;
}


