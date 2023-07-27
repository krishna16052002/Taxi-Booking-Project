import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { loadStripe } from '@stripe/stripe-js';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from 'src/app/service/socket.service';
import { UserService } from 'src/app/service/user.service';
import { StripeComponent, userdata } from '../stripe/stripe.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CountryService } from 'src/app/service/country.service';

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
  http: any;
  selectddefaultid: any;
  defaultcardid: any;
  cardLists: any;
  AddCardUser: any;
  cardlist: any = true ;
  stripe: any;
  paymentElement: any;
  elements: any;
  addcard: any;
  countrydata: any;

  constructor(
    private _userservice: UserService,
    private formBuilder: FormBuilder,
    private toster: ToastrService,
    private _socketservice : SocketService,
    public dialog: MatDialog,
    private _country :CountryService
  ) { }

  ngOnInit() {

    this. searchPricing();


    this._country.getcountrydatabasedata().subscribe({
      next: (countries: any) => {
        this.countrydata = countries;
      },
      error: (error) => {
        console.log(error);
      }
    });
    // // this.fetchData();
    // this._userservice.getcountrycodedata().subscribe({
    //   next: (countries: any) => {
    //     countries.forEach((o: any) => {
    //       if (o.idd.suffixes) {
    //         let code = o.idd.root + o.idd.suffixes[0];
    //         this.usercountrycodedata.push(code);
    //       }
    //     });
    //     this.usercountrycodedata.sort();
    //   },
    //   error: (error) => {
    //     console.log(error);
    //   },
    //   // console.log(this.usercountrycodedata);
    // });

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
    console.log(this.countryname);
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
      userphonenumber: user.userphonenumber.slice(-10),
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
    // userformdata.append('userphonenumber',this.userForm.value.userphonenumber);
    userformdata.append('userphonenumber',this.userForm.value.usercountrycode + this.userForm.value.userphonenumber );
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


  openDialog(val: any) {
    console.log(val);
    // console.log(val._id);
    // this._id = val._id

    const dialogData: userdata = {
      userdata: val,
    };

    const dialogRef: MatDialogRef<StripeComponent> = this.dialog.open(
      StripeComponent,
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



  // stripe




// async AddCard( id:any) {
//   console.log(id)
// ;

//   this.cardlist = false;
//   this.stripe = await loadStripe("pk_test_51NObn2BQlJgbeIPVDnE96vIkSEi49vOF3vQEBazaLYwOs6L1LdAfIsC8w8uZTsBjBOmWcmJYsr9VazeXdSZuTti500MZxo1uou");
//   // setTimeout(() => {
//   this.elements = this.stripe.elements();
//     console.log(this.elements);

//     this.paymentElement = this.elements.create("card")
//     await this.paymentElement.mount("#card-element");
//   // },1000)
//   this.AddCardUser = true;
//   this.addcard = true;
// }

//  async AddCardDetails(userId: any) {

//   console.log(userId);

//   try {
//     setTimeout(() => {
//     if (!this.elements || !this.paymentElement) {
//       throw new Error("Elements object is not initialized.");
//     }

//     const submitResult = this.elements.submit();
//     const { error: submitError } = submitResult;

//     if (submitError) {
//       console.log(submitError);
//       // this.handleError(submitError);
//       return;
//     }
//   },1000)
//   // Create the SetupIntent and obtain clientSecret
//   const response = await fetch(`http://localhost:5000/api/create-intent/${this.id}`, {
//       method: 'POST',
//     });
//     const { client_secret: clientSecret } = await response.json();

//     const { paymentMethod, error } = await this.stripe.createPaymentMethod({
//       type: 'card',
//       card: this.paymentElement,
//     });

//     if (error) {
//       console.log(error);
//       return;
//     }

//     const { error: confirmError } = await this.stripe.confirmCardSetup(clientSecret, {
//       payment_method: paymentMethod.id,
//     });

//     if (confirmError) {
//       console.log(confirmError);
//     } else {
//        this.getCard(this.id);
//       console.log("Successfully confirmed setup.");
//       this.toster.success("Card added successfully!");
//       this.AddCardUser = false;
//       this.cardlist = true;
//     }
//   } catch (error) {
//     console.log(error);
//   }

// }

// getCard(userId: any) {
//   this.http.get(`http://localhost:5000/api/get-card/${this.id}`)
//     .subscribe(
//       (response:any) => {
//         this.cardLists[userId] = response;
//          for (const paymentMethod of this.cardLists[userId]) {
//            if (paymentMethod.isDefault == true) {
//              this.defaultcardid =paymentMethod.id;
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
//       const response = await this.http.delete(`http://localhost:5000/api/delete-card/${cardId}`).toPromise();
//       if (response && response['message'] === 'Card deleted successfully') {
//         this.getCard(this.id);
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
//     .patch(`http://localhost:5000/api/default-card/${customerId}`, { cardId })
//     .subscribe(
//       (data:any) => {
//         console.log(data);
//         this.selectddefaultid = cardId;
//          this.getCard(this.id)
//       },
//       (error:any) => {
//         console.error("Error:", error);
//       }
//     );
// }
}


