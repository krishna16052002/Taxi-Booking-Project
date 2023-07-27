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
import { FormBuilder, FormGroup } from '@angular/forms';
import { VehicleService } from 'src/app/service/vehicle.service';

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
    'driver',
    'action',
  ];
  driverdata: any;
  drivername: any;
  ride_id: any;
  searchForm!: FormGroup;
  vehicledata: any;
  vehicle: any;
  vehiclename: any;

  constructor(
    private _createrideService: CreaterideService,
    private toaster: ToastrService,
    public dialog: MatDialog,
    private _socketservice: SocketService,
    private formBuilder: FormBuilder,
    private _vehicle: VehicleService
  ) { }
  ngOnInit() {
    this.createridedata();
    this.aftercancelride();
    this.afterrejectride();
    this.assigndriver();
    this.oncronedata();
    this.afterselectdriver();

    this.searchForm = this.formBuilder.group({
      vehicle_id: [''],
      cashCard: [''],
      fromdate: [''],
      todate: [''],
      pickupLocation: [''],
      dropoffLocation: [''],
      status: [''],
    });

    const formData = this.searchForm.value;
    console.log(formData);
    this._socketservice.emitconfirmride({ data: formData });

    this._vehicle.getvehicledata().subscribe((res) => {
      this.vehicledata = res;
      console.log(this.vehicledata);
    });
  }

  createridedata() {
    this._socketservice
      .afterconfirmridedata('afterconfirmridedata')
      .subscribe((data: any) => {
        this.ridedata = data.ridehistorydata;
        console.log(this.ridedata);
        console.log(this.ridedata);
      });
  }

  // createridedata() {
  //   this._createrideService.getridedata().subscribe((res) => {
  //     this.ridedata = res;
  //     console.log(this.ridedata);
  //   });
  // }

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
    console.log(assigndriver);
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
      const formData = this.searchForm.value;
      console.log(formData);
      this._socketservice.emitconfirmride({ data: formData });
      this.createridedata();
    });
  }

  afterrejectride() {
    this._socketservice
      .onrejectedride('riderejected')
      .subscribe((data: any) => {
        const formData = this.searchForm.value;
        console.log(formData);
        this._socketservice.emitconfirmride({ data: formData });
        this.createridedata();
      });
  }

  oncronedata() {
    this._socketservice.onrejectedride('cronedata').subscribe((data: any) => {
      const formData = this.searchForm.value;
      console.log(formData);
      this._socketservice.emitconfirmride({ data: formData });
      this.createridedata();
    });
  }

  afterselectdriver() {
    this._socketservice
      .onrejectedride('afterselectdriver')
      .subscribe((data: any) => {
        const formData = this.searchForm.value;
        console.log(formData);
        this._socketservice.emitconfirmride({ data: formData });
        this.createridedata();
      });
  }

  assigndriver() {
    this._socketservice.onassigndriverdata().subscribe((response) => {
      const formData = this.searchForm.value;
      console.log(formData);
      this._socketservice.emitconfirmride({ data: formData });
      this.createridedata();
    });
  }
  runningrequest() {
    this._socketservice.onrunningrequest('runningrequest').subscribe((data: any) => {
      const formData = this.searchForm.value;
      console.log(formData);
      this._socketservice.emitconfirmride({ data: formData });
      this.createridedata();
    });
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

    this._socketservice.emitconfirmride({ data: formData });

    // Perform further actions, such as filtering data based on form values
  }

  clearfilter() {
    const data = {
      vehicle_id: '',
      cashCard: '',
      fromdate: '',
      todate: '',
      pickupLocation: '',
      dropoffLocation: '',
    };

    this._socketservice.emitconfirmride({ data: data });
  }

  // async AddCard(id:any) {
  //   console.log(id);

  //   this.cardlist = false;
  //   this.stripe = await loadStripe("pk_test_51NTisDLigteWfcRnZkQoTywuss8lTd3CUnil3xexs59lKQIlJcgEeJWCiMuExlDGlmtazauK0nBRj1hk6HoZOx9Q00Wt2DV8X0");

  //   this.elements = this.stripe.elements();

  //     this.paymentElement = this.elements.create("card")
  //     this.paymentElement.mount("#card-element");

  //   this.AddCardUser = true;
  //   this.addcard = true;
  // }

  // async AddCardDetails(userId: any) {

  //   console.log(userId);
  //     const paymentMethod = await this.stripe.createToken(
  //       this.cardElement,
  //     );
  //     const token = await paymentMethod.token
  //     console.log('succes: ',await  paymentMethod.token);
  // console.log('error: ', await error);

  // try {
  //   setTimeout(() => {
  //     if (!this.elements || !this.cardElement) {
  //       throw new Error("Elements object is not initialized.");
  //     }

  //     const submitResult = this.elements.submit();
  //     const { error: submitError } = submitResult;

  //     if (submitError) {
  //       console.log(submitError);
  //       // this.handleError(submitError);
  //       return;
  //     }
  //   }, 1000)
  //   // Create the SetupIntent and obtain clientSecret

  // const response = await fetch(`http://localhost:8080/create-intent/${userId}`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-type': 'Application/json'
  //   },
  //   body: JSON.stringify({token})
  // });
  //   const { client_secret: clientSecret } = await response.json();
  //   console.log(clientSecret);
  //   const { paymentMethod, error } = await this.stripe.createPaymentMethod({
  //     type: 'card',
  //     card: this.cardElement,
  //   });

  //   if (error) {
  //     console.log(error);
  //     return;
  //   }

  //   const { error: confirmError } = await this.stripe.confirmCardSetup(clientSecret, {
  //     payment_method: paymentMethod.id,
  //   });

  //   if (confirmError) {
  //     console.log(confirmError);
  //   } else {
  //     //  this.getCard(this.userid);
  //     console.log("Successfully confirmed setup.");
  //     this.toster.success("Card added successfully!");

  //   }
  // } catch (error) {
  //   console.log(error);
  // }

  // }

  // getCard(userId: any) {
  //   this.http.get(`http://localhost:8080/get-card/${userId}`)
  //     .subscribe(
  //       (response:any) => {
  //         this.cardLists[userId] = response;
  //          for (const paymentMethod of this.cardLists[userId]) {
  //            if (paymentMethod.isDefault == true) {
  //              this.defaultcardid = paymentMethod.id;
  //                break;
  //            }
  //          }
  //       },
  //       (error:any) => {
  //         console.error('Error:', error);
  //       }
  //     );
  // }

  // async deleteCard(cardId: any) {
  //   const confirmDelete = confirm("Are you sure you want to delete this card?");
  //   if (confirmDelete) {
  //     try {
  //       const response = await this.http.delete(`http://localhost:8080/delete-card/${cardId}`).toPromise();
  //       if (response) {
  //         // this.getCard(this.id);
  //         this.toster.success("Card deleted successfully!");
  //       } else {
  //         throw new Error("Failed to delete card");
  //       }
  //     } catch (error:any) {
  //       console.error(error);
  //       this.toster.error("Failed to delete card", "");
  //     }
  //   }
  // }

  // async SetDefault(customerId: any,cardId: any) {
  //   console.log(customerId);
  //   console.log(cardId);
  //   this.http
  //     .patch(`http://localhost:8080/default-card/${customerId}`, { cardId })
  //     .subscribe(
  //       (data:any) => {
  //         console.log(data);
  //         this.selectddefaultid = cardId;
  //         //  this.getCard(this.id)
  //       },
  //       (error:any) => {
  //         console.error("Error:", error);
  //       }
  //     );
  // }
}
