import { Component } from '@angular/core';
import { SocketService } from 'src/app/service/socket.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FeedbackComponent, ride } from '../feedback/feedback.component';
import { CreaterideService } from 'src/app/service/createride.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-runningrequest',
  templateUrl: './runningrequest.component.html',
  styleUrls: ['./runningrequest.component.css'],
})
export class RunningrequestComponent {
  ridedata: any;
  displayedColumns: string[] = [
    'requestId',
    'userId',
    'userName',
    'pickupTime',
    'pickupLocation',
    'destinationLocation',
    'service',
    'driver',
    'action',
  ];
  runningrequestdata: any;
  ride_id: any;
  driver_id: any;
  status: string = 'pending'; // Set the initial status here (for example, 'pending')
  showAceeptbutton: boolean = false;
  showArrivedbutton: boolean = false;
  showPickedButton: boolean = false;
  showStartedButton: boolean = false;
  showCompletedButton: boolean = false;
  feedback: any;

  constructor(private _socketservice: SocketService , public dialog: MatDialog, private _createrideService : CreaterideService , private toastr : ToastrService) {}

  ngOnInit() {
    this.showAceeptbutton = true;
    this.afterrideidnull();
    this.runningridedata();
    this.assigndriver();
    this.onassignnearestdriverdata();
    this.afterselectdriver();
    this.afternulldriverdata();
    this.updateride();
    // this.afternullridedata();
    this._socketservice.emitridedata(this.ridedata);
    const storedStatus = localStorage.getItem('rideStatus');
    if (storedStatus) {
      this.status = storedStatus;
    }
  }

  runningridedata() {
    this._socketservice
      .onrunningrequest('runningrequest')
      .subscribe((data: any) => {
        this.ridedata = data;

        this.runningrequestdata = this.ridedata.runningrequestdata;
        console.log(this.runningrequestdata);
      });
  }
  // when assigndriver then data change that all this tab
  assigndriver() {
    this._socketservice
      .assigndriverchange('assigndriver')
      .subscribe((data: any) => {
        this._socketservice.emitridedata(this.ridedata);
        this._socketservice
          .onrunningrequest('runningrequest')
          .subscribe((data: any) => {
            this.ridedata = data;
            this.runningrequestdata = this.ridedata.runningrequestdata;
          });
      });
  }

  rejectride(ride: any) {
    this.ride_id = ride._id;
    console.log(this.ride_id, 'rideid');
    this.driver_id = ride.driver_id;
    console.log(this.driver_id, 'driverid');
    this._socketservice.emitrejectedride({
      ride_id: this.ride_id,
      driver_id: this.driver_id,
    });
  }

  // after ride rejected
  afterrideidnull() {
    this._socketservice
      .onrejectedride('riderejected')
      .subscribe((data: any) => {
        this._socketservice.emitridedata(this.ridedata);
        this._socketservice
          .onrunningrequest('runningrequest')
          .subscribe((data: any) => {
            this.ridedata = data;
            // console.log(this.ridedata);
            this.runningrequestdata = this.ridedata.runningrequestdata;
            // console.log(this.runningrequestdata);
          });
      });
  }

  //  assignnearestdriver
  onassignnearestdriverdata() {
    this._socketservice
      .onassignnearestdriverdata('afterassignnearestdriverdata')
      .subscribe((data: any) => {
        this._socketservice.emitridedata(this.ridedata);
        this._socketservice
          .onrunningrequest('runningrequest')
          .subscribe((data: any) => {
            this.ridedata = data;
            // console.log(this.ridedata);
            this.runningrequestdata = this.ridedata.runningrequestdata;
            // console.log(this.runningrequestdata);
          });
      });
  }

  afterselectdriver() {
    this._socketservice
      .afterselectdriver('afterselectdriver')
      .subscribe((data: any) => {
        this._socketservice.emitridedata(this.ridedata);
        this._socketservice
          .onrunningrequest('runningrequest')
          .subscribe((data: any) => {
            this.ridedata = data;
            this.runningrequestdata = this.ridedata.runningrequestdata;
          });
      });
  }

  afternulldriverdata() {
    this._socketservice
      .afternulldriverdata('afternulldriverdata')
      .subscribe((data: any) => {
        this._socketservice.emitridedata(this.ridedata);
        this._socketservice
          .onrunningrequest('runningrequest')
          .subscribe((data: any) => {
            this.ridedata = data;
            this.runningrequestdata = this.ridedata.runningrequestdata;
          });
      });
  }

  // afternullridedata(){
  //   this._socketservice.afternullridedata('afternullridedata').subscribe((data: any) => {
  //     this._socketservice.emitridedata(this.ridedata);
  //     this._socketservice.onrunningrequest('runningrequest').subscribe((data: any) => {
  //       this.ridedata = data;
  //       this.runningrequestdata = this.ridedata.runningrequestdata
  //     });
  //   });
  // }

  updateride() {
    this._socketservice.updateride('updateride').subscribe((data: any) => {
      this._socketservice.emitridedata(this.ridedata);
      this._socketservice
        .onrunningrequest('runningrequest')
        .subscribe((data: any) => {
          this.ridedata = data;
          this.runningrequestdata = this.ridedata.runningrequestdata;
        });
    });
  }

  acceptride(ride: any) {
    // this.showArrivedbutton = true ;
    // console.log(ride);
    this._socketservice.emitaccepted({
      ride_id: ride._id,
      driver_id: ride.driver_id,
    });
  }
  arrived(ride: any) {
    console.log(ride);

    this.showPickedButton = true;
    this._socketservice.arrived({
      ride_id: ride._id,
      driver_id: ride.driver_id,
    });
  }
  picked(ride: any) {
    this.showStartedButton = true;
    this.showCompletedButton = false;
    this._socketservice.picked({
      ride_id: ride._id,
      driver_id: ride.driver_id,
    });
  }

  started(ride: any) {
    this.showCompletedButton = true;

    this._socketservice.started({
      ride_id: ride._id,
      driver_id: ride.driver_id,
    });
  }

  completed(ride: any) {
    console.log(ride);

    this.showStartedButton = false;
    this._socketservice.Completed({
      ridedata:ride,
      ride_id: ride._id,
      driver_id: ride.driver_id,
    });
  }

  openDialog(val: any) {
    console.log(val);
    // console.log(val._id);
    const id = val._id




    const dialogData: ride = {
      ride: val,
    };

    const dialogRef: MatDialogRef<FeedbackComponent> = this.dialog.open(
      FeedbackComponent,
      {
        width: '600px',
        data: dialogData,
      }
    );

    dialogRef.afterClosed().subscribe((data: string) => {
      console.log(data);
      this._createrideService.updateride(data).subscribe({
        next: (res: any) => {
          // let updateuser = this.feedback.find((obj: any) => {
          //   return obj._id === res._id;
          // });
          this.toastr.success("Feedback Send Succesfully")
        },
        error: (error) => {
          console.log(error);
        },
      });
    });
  }

}
