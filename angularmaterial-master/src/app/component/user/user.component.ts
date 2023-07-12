import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from 'src/app/service/socket.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent {
  userForm!: FormGroup;
  isshow: boolean = false;
  countryname: any;
  uploadedimage: any;
  usercountrycodedata: any = [];
  userdatabasedata: any = [];
  addbuttonshow: boolean = false;
  updatebuttonshow: boolean = false;
  addupdate: boolean = false;

  // table

  citydatabasedata: any;
  // page: number = 1;
  // count: number = 0;
  tableSize: number = 3;
  tableSizes: any = [3, 6, 9, 12];
  p: number = 1;
  pageSize: any;
  dropdown: any;
  selectedOption: any;
  id: any;

// pagination
currentPage: number = 1;
totalPages: number = 0;
// limit: number = 3;
  loading: any;
  query: any;
// data
page: number = 1;
limit: number = 2;
search: string = '';
sortField: string = '';
sortOrder: string = 'asc';
pricing: any;
count: number = 0;
totalPage: number = 0;
  data: any;

  constructor(
    private _userservice: UserService,
    private formBuilder: FormBuilder,
    private toster: ToastrService,
    private _socketservice : SocketService
  ) { }

  ngOnInit() {

    this. searchPricing();
    // this.fetchData();
    this._userservice.getcountrycodedata().subscribe({
      next: (countries: any) => {
        countries.forEach((o: any) => {
          if (o.idd.suffixes) {
            let code = o.idd.root + o.idd.suffixes[0];
            this.usercountrycodedata.push(code);
          }
        });
        this.usercountrycodedata.sort();
      },
      error: (error) => {
        console.log(error);
      },
      // console.log(this.usercountrycodedata);
    });

    this.userForm = this.formBuilder.group({
      username: ['' , Validators.required],
      useremail: ['', [Validators.required , Validators.email]],
      userphonenumber: ['', [Validators.required , Validators.maxLength(10) , Validators.minLength(10)]],
      usercountrycode: ['', Validators.required],
      image: [''],
    });
    // this._userservice.getuser().subscribe((res) => {
    //   this.userdatabasedata = res;
    // });
  }
  // getimage
  getimage(event: any) {
    console.log(event.target.files[0]);
    this.uploadedimage = event.target.files[0];
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
    this.userForm.reset();
  }

  onSelected(value: string): void {
    this.countryname = value;
    // console.log(this.countryname);
  }

  Onupdatebuttonclick(_id: string, user: any) {
    this.addupdate = true; // addupdate for kiyare kai button submit thase ena mate che jiyare onupdatebutton function call thase atle addupdate true thase tiyare on submit ma addupdate true hase tiyare update user  thase
    this.updatebuttonshow = true;
    this.addbuttonshow = false;
    this.userForm.reset();
    console.log(_id);
    this.id = user._id;
    console.log(this.id);

    if (this.isshow) {
      this.isshow = this.isshow;
      console.log('hhhhhh');
    } else {
      this.isshow = !this.isshow;
    }
    this.userForm.patchValue({
      username: user.username,
      useremail: user.useremail,
      userphonenumber: user.userphonenumber,
      usercountrycode: user.usercountrycode,
    });
  }

  Ondelete(_id: string) {
      if (confirm('Are you sure you want to delete this user?')) {
        this._userservice.deleteuser(_id).subscribe(
          (res) => {
            console.log(res);
            this.searchPricing();
            this.toster.success(res.message);
          },
          (err) => {
            console.log(err);
          }
        );
      }
    }

  cancel() {
    this.isshow = false;
  }
  OnSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    const userformdata = new FormData();
    console.log(this.userForm.value.username);
    userformdata.append('username', this.userForm.value.username);
    userformdata.append('useremail', this.userForm.value.useremail);
    userformdata.append('userphonenumber', this.userForm.value.userphonenumber);
    userformdata.append('usercountrycode', this.userForm.value.usercountrycode);
    if (this.uploadedimage) {
      userformdata.append('image', this.uploadedimage);
    }
    // console.log(userformdata);
    if (this.addupdate ) {
      // update
      this._userservice.updateuser(userformdata, this.id).subscribe({
        next: (res: any) => {
          let updateuser = this.userdatabasedata.find((obj: any) => {
            return obj._id === res._id;
          });
          // console.log(updateteduser);
          // console.log(res._id);

          // let key = Object.keys(updateuser);

          // key.forEach((key: any) => {
          //   updateuser[key] = res[key];
          // });
          this.toster.success(res.message);
          this.searchPricing();
          this.userForm.reset();
        },
        error: (error) => {
          console.log(error.error.message);
          this.toster.warning(error.error.message);
        },
      });
    } else {
      // add
      this._userservice.adduser(userformdata).subscribe({
        next: (res: any) => {
          // this.userdatabasedata.push(res.userdata);
          this.searchPricing();
          this.toster.success(res.message);
        },
        error: (error) => {
          console.log(error);

          console.log(error.error.message);
          this.toster.warning(error.error.message);
        },
      });
      this.userForm.reset();
    }
  }

// pagination

  // fetchData(): void {
  //   const page = this.currentPage;
  //  // Set the desired limit value

  //   this._userservice.getuserpagination(page, this.limit).subscribe(
  //     (response: any) => {
  //       this.userdatabasedata = response;
  //       this.totalPages = response.totalPage;
  //       console.log(response.pricing);
  //       const data = response.pricing.map((obj:any) => obj)
  //       console.log(this.userdatabasedata);
  //       console.log(data);
  //       this.userdatabasedata = data


  //     },
  //     (error: any) => {
  //       console.log(error);
  //     }
  //   );
  // }


  // previousPage(): void {
    //   if (this.currentPage > 1) {
  //     this.currentPage--;
  //     this.fetchData();
  //   }
  // }

  // nextPage(): void {
  //   if (this.currentPage < this.totalPages) {
    //     this.currentPage++;
  //     this.fetchData();
  //   }
  // }

  //  search


  // search(query:any ) {

  //   if (!this.query) {
  //     return this.fetchData();
  //   }

  //   this.loading = true;

  //  this._userservice.searchuser(query).subscribe(
    //       (response) => {

  //         this.userdatabasedata = response;

  //         this.loading = false;
  //       },
  //       (error) => {
  //         console.error(error);
  //         this.loading = false;
  //       }
  //     );
  // }


  searchPricing() {
    this._userservice.getUserData(this.page, this.limit, this.search, this.sortField, this.sortOrder)
      .subscribe(response => {
        this.pricing = response.pricing;
        this.count = response.count;
        this.totalPage = response.totalPage;
      });
  }

  onPageChange(page: number){
    this.page = page;
    this.searchPricing();
  }

  onSortFieldChange(sortField: string){
    this.sortField = sortField;
    this.searchPricing();
  }
  onSortOrderChange(sortOrderSelect: any): void {
    this.sortOrder = sortOrderSelect || '';
    this.searchPricing();
  }

  onChangeLimit() {
    this.currentPage = 1; // Reset the current page to 1
    this.searchPricing(); // Fetch data based on the new limit
  }
}


