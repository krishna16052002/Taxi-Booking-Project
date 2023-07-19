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
    'driver',
    'action'
  ];
  runningrequestdata: any;
  ride_id: any;
  driver_id: any;
  status: string = 'assignning'; // Set the initial status here (for example, 'pending')
  showPickedButton: boolean = false;

  constructor(private _socketservice : SocketService){}

  ngOnInit() {
    this.afterrideidnull();
    this.runningridedata();
    this.assigndriver();
    this.onassignnearestdriverdata();
    this.afterselectdriver();
    this.afternulldriverdata();
    // this.afternullridedata();
    this._socketservice.emitridedata(this.ridedata)
    const storedStatus = localStorage.getItem('rideStatus');
    if (storedStatus) {
      this.status = storedStatus;
    }

     }

   runningridedata(){
    this._socketservice.onrunningrequest('runningrequest').subscribe((data: any) => {
      this.ridedata = data;

      this.runningrequestdata = this.ridedata.runningrequestdata
      console.log(this.runningrequestdata);
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

// after ride rejected
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


  //  assignnearestdriver
  onassignnearestdriverdata(){
    this._socketservice.onassignnearestdriverdata('afterassignnearestdriverdata').subscribe((data: any) => {
      this._socketservice.emitridedata(this.ridedata);
      this._socketservice.onrunningrequest('runningrequest').subscribe((data: any) => {
        this.ridedata = data;
        // console.log(this.ridedata);
        this.runningrequestdata = this.ridedata.runningrequestdata
        // console.log(this.runningrequestdata);
      });
    });
  }

  afterselectdriver(){
    this._socketservice.afterselectdriver('afterselectdriver').subscribe((data: any) => {
      this._socketservice.emitridedata(this.ridedata);
      this._socketservice.onrunningrequest('runningrequest').subscribe((data: any) => {
        this.ridedata = data;
        this.runningrequestdata = this.ridedata.runningrequestdata
      });
    });
  }

  afternulldriverdata(){
    this._socketservice.afternulldriverdata('afternulldriverdata').subscribe((data: any) => {
      this._socketservice.emitridedata(this.ridedata);
      this._socketservice.onrunningrequest('runningrequest').subscribe((data: any) => {
        this.ridedata = data;
        this.runningrequestdata = this.ridedata.runningrequestdata
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

  acceptride(ride :any ){
    // console.log(ride);
    this._socketservice.emitaccepted({ride_id : ride._id , driver_id : ride.driver_id})
    this.status = 'accepted';
    localStorage.setItem('rideStatus', this.status);

  }
  arrived() {
    console.log('Arrived button clicked!');
    this.status = 'arrived';
    localStorage.setItem('rideStatus', this.status);
    this.showPickedButton = true;
  }
    
  picked(){

  }

}


