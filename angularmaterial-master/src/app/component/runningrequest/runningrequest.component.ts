import { Component } from '@angular/core';
import { SocketService } from 'src/app/service/socket.service';

@Component({
  selector: 'app-runningrequest',
  templateUrl: './runningrequest.component.html',
  styleUrls: ['./runningrequest.component.css']
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
    'action'
  ];
  runningrequestdata: any;
  ride_id: any;
  driver_id: any;

  constructor(private _socketservice : SocketService){}

  ngOnInit() {
    this.afterrideidnull();
    this.runningridedata();
    this.assigndriver();
    this._socketservice.emitridedata(this.ridedata)
     }

   runningridedata(){
    this._socketservice.onrunningrequest('runningrequest').subscribe((data: any) => {
      this.ridedata = data;
      this.runningrequestdata = this.ridedata.runningrequestdata
    });

   }
// when assigndriver then data change that all this tab
   assigndriver(){
    this._socketservice.assigndriverchange('assigndriver').subscribe((data: any) => {
      this._socketservice.emitridedata(this.ridedata);
      this._socketservice.onrunningrequest('runningrequest').subscribe((data: any) => {
        this.ridedata = data;
        this.runningrequestdata = this.ridedata.runningrequestdata
      });
    });

   }

   rejectride(ride:any){
    this.ride_id = ride._id
    console.log(this.ride_id , "rideid");
    this.driver_id = ride.driver_id
    console.log(this.driver_id , "driverid");
     this._socketservice.emitrejectedride({ride_id: this.ride_id , driver_id : this.driver_id })
   }

// after ruide rejected
   afterrideidnull(){
    this._socketservice.onrejectedride('riderejected').subscribe((data: any) => {
      this._socketservice.emitridedata(this.ridedata);
      this._socketservice.onrunningrequest('runningrequest').subscribe((data: any) => {
        this.ridedata = data;
        // console.log(this.ridedata);
        this.runningrequestdata = this.ridedata.runningrequestdata
        // console.log(this.runningrequestdata);
      });
    });
   }


}


