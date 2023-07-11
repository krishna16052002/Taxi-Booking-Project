import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CityService } from 'src/app/service/city.service';
import { DriverService } from 'src/app/service/driver.service';
import { CountryService } from 'src/app/service/country.service';
import { HttpClient } from '@angular/common/http';
import { VehicleService } from 'src/app/service/vehicle.service';
import { DriverData, DrivermodelComponent } from '../drivermodel/drivermodel.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SocketService } from 'src/app/service/socket.service';
// import { MatDialog } from '@angular/material/dialog';
// import { Socket } from 'socket.io-client';



interface Driver {
  status: boolean;
}

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.css']
})

export class DriversComponent {


  driverForm!: FormGroup;
  isshow: boolean = false;
  addbuttonshow: boolean = false;
  updatebuttonshow: boolean = false;
  addupdate: boolean = false;
  id: any;
  countrydata: any;
  country: any;
  countryName: any;
  citiesdata: any;
  countrycode: any;
  citydata: any;
  citynamedata: any[] = [];
  city: any;
  driverdatabasedata: any;
  uploadedimage: any;

  drivers: Driver[] = [];
  // table
  // page: number = 1;
  // count: number = 0;
  tableSize: number = 3;
  tableSizes: any = [3, 6, 9, 12];
  p: number = 1;
  pageSize: any;
  dropdown: any;
  selectedOption: any;
  drivercity: any;
  isChecked: boolean = false;
  Approved: any;
  updateidforchangedriver: any;
  // pagination
  // currentPage: number = 1;
  // totalPages: number = 0;
  // limit: number = 2;
  driverdata: any;
  countryid: any;
  // data
  page: number = 1;
  limit: number = 5;
  search: string = '';
  sortField: string = '';
  sortOrder: string = 'asc';
  pricing: any;
  count: number = 0;
  totalPage: number = 0;
  currentPage: number = 1;
  driver: any;
  vehicle: any;
  vehicledata: any = [];
  vehiclename: any;
  dialogRef: any;
  createrideservice: any;
  assignServices: any;
  _id: any;
  // dialog: any;

  constructor(
    private _driverservice: DriverService,
    private formBuilder: FormBuilder,
    private toster: ToastrService,
    private _cityservice: CityService,
    private _country: CountryService,
    private _vehicle: VehicleService,
    private http: HttpClient,
    public dialog: MatDialog,
    private _socketservice : SocketService
  ) { }

  ngOnInit() {
    this.updatevehicletype();
    this.updateonCheckboxChange();
    this.Driverdata();
    this.driverForm = this.formBuilder.group({
      country_id: ['', [Validators.required]],
      city_id: ['', [Validators.required]],
      drivername: ['', [Validators.required]],
      driveremail: ['', [Validators.required, Validators.email]],
      driverphonenumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      drivercountrycode: ['', [Validators.required]],
      image: ['']
    });
    this._country.getcountrydatabasedata().subscribe({
      next: (countries: any) => {
        this.countrydata = countries
        // console.log(this.countrydata);
      },
      error: (error) => {
        console.log(error);
      },
      // console.log(this.usercountrycodedata);
    });

    this._cityservice.getcity().subscribe({
      next: (cities: any) => {
        this.citydata = cities
        // console.log(this.citydata);
      },
      error: (error) => {
        console.log(error);
      },
      // console.log(this.usercountrycodedata);
    });

    this._driverservice.getdriver().subscribe(
      (response: any) => {
        // this.fetchcitydata();
        this.driverdatabasedata = response;
        console.log(response);

      },
      (error: any) => {
        console.log(error);
      }
    );

    this._vehicle.getvehicledata().subscribe((res) => {
      this.vehicledata = res;
      // console.log(this.vehicledata);
    });
  }


  openDialog(val: any) {
    console.log(val);
    console.log(val._id);
    this._id = val._id
    const dialogData: DriverData = {
      title: 'Assigned Ride Service',
      id: val._id
    };
    const dialogRef: MatDialogRef<DrivermodelComponent> = this.dialog.open(DrivermodelComponent, {
      width: '400px',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe((data: string) => {
      console.log(data);
      console.log(this._id);
      // const payload = {
      //   assignService: data,
      //   id: this._id,
      // }
    this._socketservice.emitchangedrivervehicletype({id : this._id , assignServices: data})
      // this._driverservice.assignservices(this._id, payload).subscribe({
      //   next: (res: any) => {
      //     console.log(res);

      //     let updateuser = this.driverdatabasedata.find((obj: any) => {
      //       return obj._id === res._id;
      //     });
      //     this.Driverdata();
      //     this.toster.success(res.message);
      //   },
      //   error: (error) => {
      //     console.log(error.error.message);
      //     this.toster.warning(error.error.message);
      //   },
      // });
    });
  }

  updatevehicletype(){
    this._socketservice.onchangedrivervehicletype('changevehicletype').subscribe((data: any) => {
      this.drivers = data.updateDriver;
      console.log(this.drivers);
      this.toster.success(data.message)
      this.Driverdata();
    });
  }


  onSelected(value: string): void {
    this.countryid = value;
    console.log(this.country);

    this.countrydata.map((country: any) => {
      if (country._id === value) {
        this.countryName = country.countryname;
        console.log(this.countryName);
      }
    });
    // countryname use for find this countrycode
    this._country.getcountry(this.countryName).subscribe((res) => {

      this.country = res;
      this.countrycode = this.country[0].idd.root + this.country[0].idd.suffixes;
      // console.log(this.countrycode);

      this.driverForm.patchValue({
        drivercountrycode: this.countrycode,
      })
    });

    this.citynamedata = [];

    this.citydata.map((city: any) => {
      if (city.country_id === value) {
        this.city = city;
        this.citynamedata.push(this.city);
        console.log(this.citynamedata);
      }
    });
  }

  onSelectedcity(value: string) {

    this.city = value;
    console.log(this.city);
  }

  onchangeevent(event: any) {
    this.Approved = event.target.checked
  }

  onCheckboxChange(_id: string) {
    this.updateidforchangedriver = _id;
    console.log(this.Approved);
    // this.Approved = !this.Approved
    // if(this.isChecked== true ){
    //  this.Approved = this.isChecked;
    //  console.log(this.Approved);
    // }else {
    //  this.Approved =  this.isChecked ;
    //  console.log(this.Approved);
    // }
    const driverformdata = new FormData();
    driverformdata.append('status', this.Approved);
    driverformdata.append('id', _id)
    console.log(driverformdata);
    this._socketservice.emitchangedriverstatus({ id: _id, status: this.Approved })
    // console.log('Checkbox state:', this.isChecked);

    // this._driverservice.changedriverstatus({ id: _id, status: this.Approved }).subscribe({
    //   next: (res: any) => {
    //     console.log(res.id);

    //     let updatetoggel = this.driverdatabasedata.find((obj: any) => {
    //       return obj._id === res.id;
    //     });
    //     // console.log(updatetoggel);
    //     // console.log(res._id);

    //     // let key = Object.keys(updatetoggel);

    //     // key.forEach((key: any) => {
    //     //   updatetoggel[key] = res[key];
    //     // });
    //     this.Driverdata();
    //     this.toster.success(res.message);
    //   },
    //   error: (error) => {
    //     console.log(error.error.message);
    //     this.toster.warning(error.error.message);
    //   },
    // });

  }
//   update driver status listen the socket event
  updateonCheckboxChange(){
    this._socketservice.onDriverStatusChanged('driverstatuschanged').subscribe((data: any) => {
      this.drivers = data.updateDriver;
      console.log(this.drivers);
      this.toster.success(data.message)
      this.Driverdata();
    });
  }



  OnAddbuttonclick(): void {
    this.isshow = true;
    this.addbuttonshow = true;
    this.updatebuttonshow = false;
    if (this.isshow) {
      this.isshow = this.isshow;
      // console.log("hhhhhh");
    } else {
      this.isshow = !this.isshow;
    }
    this.driverForm.reset();
  }

  Onupdatebuttonclick(_id: string, driver: any) {
    this.addupdate = true;
    this.updatebuttonshow = true;
    this.addbuttonshow = false;
    this.driverForm.reset();
    console.log(_id);
    this.id = driver._id;
    console.log(this.id);

    if (this.isshow) {
      this.isshow = this.isshow;
      // console.log('hhhhhh');
    } else {
      this.isshow = !this.isshow;
    }
    this.driverForm.patchValue({
      drivername: driver.drivername,
      driveremail: driver.driveremail,
      driverphonenumber: driver.driverphonenumber,
      country_id: driver.country_id,
      city_id: driver.city_id,
      drivercountrycode: driver.drivercountrycode
    });
  }

  cancel() {
    this.isshow = false;
  }

  getimage(event: any) {
    console.log(event.target.files[0]);
    this.uploadedimage = event.target.files[0];
  }

  OnSubmit() {
    if(this.driverForm.invalid){
      this.driverForm.markAllAsTouched();
      return
    }

    const driverformdata = new FormData();
    // console.log(this.driverForm.value.drivername);
    driverformdata.append('drivername', this.driverForm.value.drivername);
    driverformdata.append('driveremail', this.driverForm.value.driveremail);
    driverformdata.append('driverphonenumber', this.driverForm.value.driverphonenumber);
    driverformdata.append('drivercountrycode', this.driverForm.value.drivercountrycode);
    driverformdata.append('city_id', this.city);
    driverformdata.append('country_id', this.countryid);
    if (this.uploadedimage) {
      driverformdata.append('image', this.uploadedimage);
    }
    // console.log(driverformdata);
    if (this.addupdate) {
      // update
      this._driverservice.updatedriver(driverformdata, this.id).subscribe({
        next: (res: any) => {
          let updateuser = this.driverdatabasedata.find((obj: any) => {
            return obj._id === res._id;
          });
          // console.log(updateteduser);
          // console.log(res._id);

          // let key = Object.keys(updateuser);

          // key.forEach((key: any) => {
          //   updateuser[key] = res[key];
          // });
          this.toster.success(res.message);
          this.Driverdata();
          this.driverForm.reset();
        },
        error: (error) => {
          console.log(error.error.message);
          this.toster.warning(error.error.message);
        },
      });
    } else {
      // add
      this._driverservice.adddriver(driverformdata).subscribe({
        next: (res: any) => {
          this.Driverdata();
          // this.driverdatabasedata.push(res.driverdata);
          this.toster.success(res.message);
          this.Driverdata()
        },
        error: (error) => {
          console.log(error);

          console.log(error.error.message);
          this.toster.warning(error.error.message);
        },
      });
      this.driverForm.reset();
    }
  }

  Ondelete(_id: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this._driverservice.deletedriver(_id).subscribe(
        (res) => {
          console.log(res);
          this.Driverdata();
          this.toster.success(res.message);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  Driverdata() {
    this._driverservice.getDriverData(this.page, this.limit, this.search, this.sortField, this.sortOrder)
      .subscribe(response => {
        this.driver = response.driver;
        this.count = response.count;
        this.totalPage = response.totalPage;
        console.log(response);


      });
  }

  onPageChange(page: number) {
    this.page = page;
    this.Driverdata();
  }

  onSortFieldChange(sortField: string) {
    this.sortField = sortField;
    this.Driverdata();
  }

  onSortOrderChange(sortOrderSelect: any): void {
    this.sortOrder = sortOrderSelect || '';
    this.Driverdata();
  }

  onChangeLimit() {
    this.currentPage = 1; // Reset the current page to 1
    this.Driverdata(); // Fetch data based on the new limit
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
  //  fetchData(): void {
  //     const page = this.currentPage;
  //    // Set the desired limit value

  //     this._driverservice.getdriverpagination(page, this.limit).subscribe(
  //       (response: any) => {
  //         this.driverdatabasedata = response;
  //         this.totalPages = response.totalPage;
  //         console.log(response.pricing);
  //         const data = response.pricing.map((obj:any) => obj)
  //         console.log(this.driverdatabasedata);
  //         console.log(data);
  //         this.driverdatabasedata = data


  //       },
  //       (error: any) => {
  //         console.log(error);
  //       }
  //     );
  //   }

  //   onChangeLimit() {
  //     this.currentPage = 1; // Reset the current page to 1
  //     this.fetchData(); // Fetch data based on the new limit
  //   }

  //   previousPage(): void {
  //     if (this.currentPage > 1) {
  //       this.currentPage--;
  //       this.fetchData();
  //     }
  //   }

  //   nextPage(): void {
  //     if (this.currentPage < this.totalPages) {
  //       this.currentPage++;
  //       this.fetchData();
  //     }
  //   }
}
