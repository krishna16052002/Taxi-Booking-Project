import { Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup, NgForm } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { VehicleService } from 'src/app/service/vehicle.service';

@Component({
  selector: 'app-vehicle-type',
  templateUrl: './vehicle-type.component.html',
  styleUrls: ['./vehicle-type.component.css'],
})
export class VehicleTypeComponent {
  id: any;
  vehicleform!: FormGroup;
  submitted = false;
  uploadedimage: any;
  isshow: boolean = false;
  vehicledatadfghjk: any = [];
  vehicle: any;
  addbuttonshow: boolean = false;
  updatebuttonshow: boolean = false;
  addupdate: any

  constructor(
    private formBuilder: FormBuilder,
    private _vehicle: VehicleService,
    private toster: ToastrService
  ) { }

  ngOnInit() {
    this.vehicleform = this.formBuilder.group({
      vehiclename: ['', [Validators.required]],
      image: ['']
    });
    // get data
    this._vehicle.getvehicledata().subscribe((res) => {
      this.vehicledatadfghjk = res;
    });

  }
  // for image get
  getimage(event: any) {
    console.log(event.target.files[0]);
    this.uploadedimage = event.target.files[0];
  }

  OnSubmit() {
    if(this.vehicleform.invalid){
      this.vehicleform.markAllAsTouched();
      return;
    }
    const vehicledata = new FormData();
    console.log(this.vehicleform.value.vehiclename);

    vehicledata.append('vehiclename', this.vehicleform.value.vehiclename);
    if (this.uploadedimage) {
      vehicledata.append('image', this.uploadedimage);

    }


    if (this.addupdate) {
      console.log("update...............");

      // update
      this._vehicle.updatevehicle(vehicledata, this.id).subscribe({
        next: (res: any) => {
          let updatetedVehicle = this.vehicledatadfghjk.find((obj: any) => {
            return obj._id === res._id
          })
          // console.log(updatetedVehicle);
          let key = Object.keys(updatetedVehicle)

          key.forEach((key: any) => {
            updatetedVehicle[key] = res[key]
          })
          this.vehicleform.reset();
          this.toster.success("update vehicle successfully ");
          // let objToUpdate = this.vehicledatadfghjk.push(function (obj: any) {
          //   return obj._id == updateId})

        },
        error: (error) => {
          console.log(error.error.message);
          this.toster.warning(error.error.message)
        }
      });
    } else {
      console.log("addd....................");

      // const vehicledata = new FormData()
      // vehicledata.append("vehiclename" , this.vehicleform.value.vehiclename)
      // vehicledata.append("image" , this.uploadedimage)
      this._vehicle.addvehicle(vehicledata).subscribe({
        next: (res: any) => {
          console.log(res);
          let obj = {
            image: res.vehicledata.image
          }
          this.vehicledatadfghjk.push(res.vehicledata);
          this.toster.success(res.message);
          this.vehicleform.reset();
        },
        error: (error) => {
          console.log(error.error.message);
          this.toster.warning(error.error.message);
        },
      });
    }
  }

  OnAddbuttonclick() {
    this.addbuttonshow = true;
    this.updatebuttonshow = false;
    if (this.isshow) {
      this.isshow = this.isshow;
      // console.log("hhhhhh");
    } else {
      this.isshow = !this.isshow;
    }

  }

  // updatevehicle
    updatevehicle(_id: string, vehicle: any) {
    this.updatebuttonshow = true;
    this.addbuttonshow = false;
    console.log(vehicle);

    if (this.isshow) {
      this.isshow = this.isshow;
      console.log('hhhhhh');
    } else {
      this.isshow = !this.isshow;
    }
    // const id =  this.vehicle._id
    // console.log(id);
    this.id = vehicle._id;
    console.log(this.id);


    this.addupdate = true;
    this.vehicleform.patchValue({
      vehiclename: vehicle.vehiclename
    });
    // console.log(vehicle._id);
    // let body = {
    //   vehiclename: vehicle.vehiclename,
    //   image: vehicle.image
    // }

    // this._vehicle.updateData(body, _id)
    //   .subscribe(response => {
    //     console.log(response)
    //   })
  }

  // for cancel button in form
  cancel() {
    this.isshow = !this.isshow;
  }
}

// this._vehicle.vehicle(vehicledata).subscribe((res) => {
  //   console.log(res);
  //   if (!res.success) {
    //     this.toster.warning(" all values required");
    //   } else {
      //     this.toster.success('success');
      //     // // this._router.navigate(['/menubar'])
      //     // this.submitted = true;
      //     // if (this.vehicleform.invalid) {
        //     //   return;
        //     // } else {
          //     //   this._router.navigate(['/menubar']);
          //     //   // alert('success');
          //     //   this.toster.success('success');
          //     // }
          //   }
          // });
