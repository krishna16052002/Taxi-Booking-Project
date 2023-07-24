import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Socket } from 'socket.io-client';
import { PushnotificationService } from 'src/app/service/pushnotification.service';
import { SocketService } from 'src/app/service/socket.service';

@Component({
  selector: 'app-assigndriver',
  templateUrl: './assigndriver.component.html',
  styleUrls: ['./assigndriver.component.css'],
})
export class AssigndriverComponent {
  ridedata: any;
  entries: any[] = [];
  cityData: any;
  usersdata: any;
  vehicledata: any;
  drivers: any[] = [];
  displayedColumns: string[] = [
    'name',
    'email',
    'phonenumber',
    'service',
    'city',
    'action',
  ];
  eventData: any;
  driverdata: any;
  alldata: any;
  ride_id: any;
  driverlength: any;
  notificationSent: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AssigndriverComponent>,
    @Inject(MAT_DIALOG_DATA) public data: assigndriverdata,
    private _socketservice: SocketService,
    private notiservice:PushnotificationService
  ) { }


  ngOnInit() {
    this.changedrivervehicletype();
    // this.notiservice.requestNotificationPermission();
    this.changeassigndriver();
    this.afterrideidnull();
    this.afterassignnearestdriver();
    // console.log(this.data);
    this.ridedata = this.data.assigndriver;
    console.log(this.ridedata);
    console.log(this.ridedata._id);
    this.ride_id =this.ridedata._id
    this.entries = Object.entries(this.ridedata);
    this.cityData = this.ridedata.citydata;
    // console.log(this.ridedata.city_id);
    // console.log(this.cityData);
    this.usersdata = this.ridedata.usersdata;
    // console.log(this.usersdata);
    this.vehicledata = this.ridedata.vehicledata;
    // console.log(this.vehicledata);
    this.eventData = {
      cityId: this.ridedata.city_id,
      assignService: this.ridedata.vehicle_id,
    };
    // Listen for the 'assigndriverdata' event from the Socket.IO server
    // this._socketservice.socket.on('assigndriverdata', (data: any) => {
    //   this.drivers = data.driver;
    //   console.log(this.drivers);

    // });
    this._socketservice.emaitassigndriverdata(this.eventData);
    this._socketservice.socket.emit('assigndriverdata', this.eventData);

    // Emit the 'assigndriverdata' event to request driver data from the server
    this._socketservice.socket.on('driverstatuschanged', (data: any) => {
      this._socketservice.socket.emit('assigndriverdata', this.eventData);

      // console.log(data);
      // // observer.next(data);
      // this.drivers = data.driver.filter((driver:any) => driver.city_id === this.ridedata.city_id && driver.assignService === this.ridedata.vehicle_id)
      // console.log(this.drivers);
      this._socketservice.onassigndriverdata().subscribe((response) => {
        this.drivers = response.driver;
        console.log(this.drivers);
      });
    });

    this._socketservice.onassigndriverdata().subscribe((response) => {
      this.drivers = response.driver;
      console.log(this.drivers);
      this.driverlength = this.drivers.length
      this.notiservice.requestNotificationPermission();
      if (!this.notificationSent && this.driverlength === 0){
        this.sendNotification('Driver not Found');
        this.notificationSent = true;
      }
    });

    // this.requestPermissionAndSendNotification();

  }



  // requestPermissionAndSendNotification() {

  //   console.log(this.driverlength);

  //     this.notiservice.requestNotificationPermission();
  //     if (this.drivers.length === 0 ){
  //       this.sendNotification('This is a push notification from Angular!');
  //     }
  //   }

    sendNotification(message: string): void {

      if ('Notification' in window && Notification.permission === 'granted') {
          const notification = new Notification('Push Notification', {
            body: message,
          });
        }


    }

  //  whedriver ehicle service change then this change to the reflectedin assign driver component
  changedrivervehicletype() {
    this._socketservice.onchangedrivervehicletype('changevehicletype')
      .subscribe((data: any) => {
        this.drivers = data.updateDriver;

        this._socketservice.socket.emit('assigndriverdata', this.eventData);

        this._socketservice.onassigndriverdata().subscribe((response) => {
          this.drivers = response.driver;
          console.log(this.drivers);
        });
      });
  }

  changeassigndriver() {
    this._socketservice.assigndriverchange('assigndriver').subscribe((data: any) => {
        this._socketservice.socket.emit('assigndriverdata', this.eventData);

        this._socketservice.onassigndriverdata().subscribe((response) => {
          this.drivers = response.driver;
          // console.log(this.drivers);
        });
      });
  }

  //   when  admin assign driver button click then  that is work

  assigndriver(ride: any) {
    console.log(ride);
    (this.driverdata = ride),
      (this.alldata = {
        ridedata: this.ridedata,
        driverdata: this.driverdata,
      });

    this.dialogRef.close(this.alldata);
  }

  assignnearestdriver(){
     const assignnearestdata= {
      _id : this.ride_id,
      cityId: this.ridedata.city_id,
      assignService: this.ridedata.vehicle_id,
    }
    console.log(assignnearestdata);

    this._socketservice.emaitassignnearestdriverdata(assignnearestdata);
  }

//  when assignnearestdriver on
afterassignnearestdriver(){
  this._socketservice.onassignnearestdriverdata('afterassignnearestdriverdata').subscribe((data: any) => {
    this._socketservice.socket.emit('assigndriverdata', this.eventData);

    this._socketservice.onassigndriverdata().subscribe((response) => {
      this.drivers = response.driver;

    });
  });
 }


// when the driver reject the ride then at a time that show a data in driver list in confirmridedata
  afterrideidnull(){
    this._socketservice.onrejectedride('riderejected').subscribe((data: any) => {
      this._socketservice.socket.emit('assigndriverdata', this.eventData);

      this._socketservice.onassigndriverdata().subscribe((response) => {
        this.drivers = response.driver;

      });
    });
   }

   

  closeDialog(): void {
    this.dialogRef.close();
  }
}
export interface assigndriverdata {
  assigndriver: String;
}
