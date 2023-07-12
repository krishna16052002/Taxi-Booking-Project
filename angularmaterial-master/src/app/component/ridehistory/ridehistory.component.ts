import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SocketService } from 'src/app/service/socket.service';
import { RidehistoryinfoComponent } from '../ridehistoryinfo/ridehistoryinfo.component';
import { Ridedata } from '../rideinfo/rideinfo.component';
import { saveAs } from 'file-saver';
import * as Papa from 'papaparse';
import { FormBuilder, FormGroup } from '@angular/forms';
import { VehicleService } from 'src/app/service/vehicle.service';
@Component({
  selector: 'app-ridehistory',
  templateUrl: './ridehistory.component.html',
  styleUrls: ['./ridehistory.component.css']
})
export class RidehistoryComponent {
  searchForm!: FormGroup;
  data: any
  ridedata: any;
  runningrequestdata: any;
  ridehistory: any;
  displayedColumns: string[] = [
    'requestId',
    'userId',
    'userName',
    'pickupTime',
    'pickupLocation',
    'destinationLocation',
    'service',
    'payment',
    'status'
  ];


  ride: any;
  private _id: any;
  vehicle: any;
  vehicledata: any;
  vehiclename: any;
  constructor(public dialog: MatDialog,
    private _socketservice: SocketService , private formBuilder: FormBuilder ,     private _vehicle: VehicleService,) { }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      vehicle_id: [''],
      cashCard: [''],
      fromdate: [''],
      todate: [''],
      pickupLocation: [''],
      dropoffLocation: ['']
    });
    this.ridehistorydata();
    this.aftercancelride();
    const formData = this.searchForm.value;
    console.log(formData);
    this._socketservice.emitridehistory({ data: formData })



    this._vehicle.getvehicledata().subscribe((res) => {
      this.vehicledata = res;
      console.log(this.vehicledata);
    });
  }

  ridehistorydata() {
    this._socketservice.onridehistory('ridehistory').subscribe((data: any) => {
      this.ridedata = data;
      console.log(this.ridedata);
      this.ridehistory = this.ridedata.ridehistorydata
      console.log(this.ridehistory);

    });
  }

  aftercancelride() {
    this._socketservice.oncancelride('cancelride').subscribe((data: any) => {
      this._socketservice.emitridehistory({ data: this.data })
      this.ridehistorydata();
    });
  }


  openDialog(val: any) {
    console.log(val);
    // console.log(val._id);
    this._id = val._id

    const dialogData: Ridedata = {
      ridedata: val,
    };

    const dialogRef: MatDialogRef<RidehistoryinfoComponent> = this.dialog.open(
      RidehistoryinfoComponent,
      {
        width: '600px',
        data: dialogData,
      }
    );

    dialogRef.afterClosed().subscribe((data: string) => {
      console.log(data);
      // console.log(this._id);
      // this.assignServices = data;
      // console.log(this.assignServices);
    });
  }

  convertToCsv(data: any[]): string {
    const csv = Papa.unparse(data);
    return csv;
  }

  downloadCsv(data: any[]) {
    console.log(this.ridehistory);
    // data = this.ridehistory
    const mappedData = this.ridehistory.map((ride: any) => {
      console.log(ride);

      return {
        REQUEST_ID: ride._id,
        USER_ID: ride.userdata._id,
        VEHICLE_ID: ride.vehicledata._id,
        USER_NAME: ride.userdata.username,
        USER_EMAIL: ride.userdata.useremail,
        USER_PHONENUMBER: ride.userdata.userphonenumber,
        SERVICE_TYPE: ride.vehicledata.vehiclename,
        STATUS: ride.assigned,
        PICKUP_LOCATION: ride.startlocation,
        DESTINATION_LOCATION: ride.destinationlocation,
        PAYMENT_OPTION: ride.paymentoption,
        CREATED: ride.created,
        DATE: ride.date,
        DRIVER_ID: ride.driver_id,
        FARE: ride.estimatefare,
        ESTIMATETIME: ride.estimatetime,
        TIME: ride.time,
        DISTANCE: ride.totaldistance,
      };
    });

    const csvData = this.convertToCsv(mappedData);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'RIDE_HISTORY.csv');
  }


  onSelectedvehicle(value: string): void {
    this.vehicle = value;
    console.log(this.vehicle);

    this.vehicledata.map((vehicle: any) => {
      if (vehicle._id === value) {
        this.vehiclename = vehicle.vehiclename;
      }
    });
  }

  onSubmit() {
    // Handle form submission logic here
    const formData = this.searchForm.value;
    console.log(formData);
    // console.log('hello');

    this._socketservice.emitridehistory({ data: formData })


    // Perform further actions, such as filtering data based on form values
  }

}
