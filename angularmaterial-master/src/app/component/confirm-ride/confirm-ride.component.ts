import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CreaterideService } from 'src/app/service/createride.service';
import { Ridedata, RideinfoComponent } from '../rideinfo/rideinfo.component';
import {
  AssigndriverComponent,
  assigndriverdata,
} from '../assigndriver/assigndriver.component';
// import { Socket } from 'socket.io-client';
import { SocketService } from 'src/app/service/socket.service';

@Component({
  selector: 'app-confirm-ride',
  templateUrl: './confirm-ride.component.html',
  styleUrls: ['./confirm-ride.component.css'],
})
export class ConfirmRideComponent {
  ridedata: any[] = [];
  assigndriverdata: any[] = [];
  displayedColumns: string[] = [
    'requestId',
    'userId',
    'userName',
    'pickupTime',
    'pickupLocation',
    'destinationLocation',
    'service',
    'action',
  ];
  driverdata: any;
  drivername: any;
  ride_id: any;

  constructor(
    private _createrideService: CreaterideService,
    private toaster: ToastrService,
    public dialog: MatDialog,
    private _socketservice: SocketService
  ) { }
  ngOnInit() {
    this.createridedata();
    this.aftercancelride();
    this.afterrejectride();
  }

  createridedata() {
    this._createrideService.getridedata().subscribe((res) => {
      this.ridedata = res;
      console.log(this.ridedata);
    });
  }

  Ondelete(_id: string) {
    this._createrideService.deleteride(_id).subscribe(
      (res) => {
        console.log(res);
        this.toaster.success(res.message);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  openDialog(val: any) {
    console.log(val);
    console.log(val._id);
    // this._id = val._id

    const dialogData: Ridedata = {
      ridedata: val,
    };

    const dialogRef: MatDialogRef<RideinfoComponent> = this.dialog.open(
      RideinfoComponent,
      {
        width: '800px',
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
  openDialogassign(assigndriver: any) {
    // console.log(assigndriver);
    // console.log(assigndriver._id);
    // this._id = val._id

    const dialogData: assigndriverdata = {
      assigndriver: assigndriver,
    };

    const dialogRef: MatDialogRef<AssigndriverComponent> = this.dialog.open(
      AssigndriverComponent,
      {
        width: '1000px',
        data: dialogData,
      }
    );

    dialogRef.afterClosed().subscribe((data: string) => {
      // console.log(data);
      this.driverdata = data;
      // console.log(this.driverdata.driverdata._id);
      this.drivername = this.driverdata.driverdata.drivername;
      console.log('driver name ', this.drivername);

      const driver_id = this.driverdata.driverdata._id;
      console.log(driver_id, ' driver id ');
      const ride_id = this.driverdata.ridedata._id;
      console.log(ride_id, ' ride id ');

      this._socketservice.assigndriver({ _id: ride_id, driver_id: driver_id });

      // this.driverid =  data._id ;
      // console.log(data._id);
      // this.assignServices = data;
      // console.log(this.assignServices);
    });
  }

  cancelride(ride: any) {
    console.log(ride);
    this.ride_id = ride._id;

    this._socketservice.emitcancelride({ ride_id: this.ride_id });
  }


  aftercancelride() {
    this._socketservice.oncancelride('cancelride').subscribe((data: any) => {
        this.createridedata();
      });
  }


  afterrejectride(){
      this._socketservice.onrejectedride('riderejected').subscribe((data: any) => {
          this.createridedata();
        });
  }


}
