import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CountryService } from 'src/app/service/country.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})

export class CountryComponent {
  countryForm!: FormGroup;
  countrydata: any = [];
  selectedCountry: any = [];
  country: any;
  countryname : any ;
  countrytimezone: any;
  countrycode: any;
  countrycurrency: any;
  currencies: any;
  flag: any;
  query: string | undefined;
  isshow: boolean = false;
  countrydatabasedata: any = [];
  addcountrydata :any = {
      countryname:'',
      countrycurrency :'',
      countrytimezone:'',
      countrycode:'',
      flag:''
  }
  loading: boolean= false ;
  userdatabasedata: any;


  constructor(private _country: CountryService ,  private formBuilder: FormBuilder ,  private toster: ToastrService) {}



  ngOnInit(): void {
    // get countrydata
    this._country.getcountrydata().subscribe((res) => {
      this.countrydata = res;
      // console.log(this.countrydata);

      // this.countryForm = new FormGroup(
      //   'countryname': new FormControl({value:'',disabled:true} , [Validators.required]),
      //   'countrytimezone': new FormControl({value:'',disabled:true} , [Validators.required]),
      //   'countrycode': new FormControl({value:'',disabled:true} , [Validators.required]),
      //   'countrycurrency': new FormControl({value:'',disabled:true} , [Validators.required]),
      // );



    })



    this.countryForm = this.formBuilder.group({
      countryname:[{value:'',disabled:true} ,  Validators.required],
      countrytimezone: [{value:'',disabled:true} , Validators.required],
      countrycode:[{value:'',disabled:true}, Validators.required],
      countrycurrency:[{value:'',disabled:true}, Validators.required],
      flag:['', Validators.required]

    });






      // this.signUpForm = new FormGroup({
      //   'userData': new FormGroup({
      //     'username': new FormControl(null, [Validators.required, this.blockUser.bind(this)],),
      //     'email': new FormControl(null, [Validators.required, Validators.email], this.blockEmail),
      //   }),
      //   'gender': new FormControl('male', [Validators.required]),
      //   'hobbies': new FormArray([])
      // });





    // this.countryForm.get('countryname')?.disable();
    // this.countryForm.get('countrytimezone')?.disable();
    // this.countryForm.get('countrycode')?.disable();
    // this.countryForm.get('countrycurrency')?.disable();


    this._country.getcountrydatabasedata().subscribe((res)=>{
      this.countrydatabasedata = res;
      // console.log(this.countrydatabasedata);

    })


  }

  onSelected(value: string): void {
    this.countryname = value;
    console.log(this.countryname);

    this._country.getcountry(value).subscribe((res) => {

      this.country = res;
      this.countrytimezone = this.country[0].timezones[0];
      // console.log(this.countrytimezone);
      this.countrycode = this.country[0].idd.root + this.country[0].idd.suffixes;
      // console.log(this.countrycode);
      this.flag = this.country[0].flags.png;
      // console.log(this.flag);
      if (this.country[0].currencies) {
        const currencies = this.country[0].currencies;
        const currencyKeys = Object.keys(currencies);
        if (currencyKeys.length > 0) {
          const firstCurrencyKey = currencyKeys[0];
          const currency = currencies[firstCurrencyKey];
          if (currency && currency.symbol) {
            this.countrycurrency = currency.symbol;
            // console.log(this.countrycurrency);
          }
        }

      }
      //In this code, we first check if res is defined and has a length greater than 0. Then, we access this.country[0].currencies to get the currencies object. We retrieve the currency keys using Object.keys(currencies) and check if there is at least one currency key. If there is, we select the first currency key (currencyKeys[0]) and retrieve the corresponding currency object from currencies. Finally, we check if the currency object and symbol property exist before assigning currency.symbol to this.countrycurrency and logging it.Please note that this code assumes you want to retrieve the currency symbol for the first currency listed in the currencies object. If you want to handle multiple currencies or a different selection logic, you may need to adjust the code accordingly.

      this.countryForm.patchValue({
        countryname:  this.countryname ,
        countrytimezone:  this.countrytimezone ,
        countrycode: this.countrycode,
        countrycurrency:this.countrycurrency ,
        flag:  this.flag

    })

    });


  }

  OnSubmit(){

    if(this.countryForm.invalid){
      this.countryForm.markAllAsTouched();
      return;
    }
    // const countryForm = new FormData();
    // countryForm.append('countryname', this.countryForm.value.countryname);
    // countryForm.append('countrytimezone', this.countryForm.value.countrytimezone);
    // countryForm.append('countrycode', this.countryForm.value.countrycode);
    // countryForm.append('countrycurrency', this.countryForm.value.countrycurrency);
    // countryForm.append('flag', this.countryForm.value.flag);

    // console.log(this.countryForm.value);

    const formvalue = this.countryForm.value
    this.addcountrydata ={
      countryname:this.countryname,
      countrycurrency : this.countrycurrency,
      countrytimezone: this.countrytimezone,
      countrycode: this.countrycode,
      flag: this.flag
    }

    this._country.addcountry(this.addcountrydata).subscribe({
      next: (res: any) => {
        this.countrydatabasedata.push(res.countrydata);
        this.toster.success(res.message);
        this.countryForm.reset();
        this.flag = "";
      },
      error: (error) => {
        console.log(error);
        this.toster.error(error.error.message);
      },
    });


  }

  OnAddbuttonclick(){
    this.isshow = true;
  }

  cancel(){
    this.isshow = false;
    console.log(this.countryname);
  }


  // search(query:any){
  //   this.loading = true;

  //   this._country.getcountryData(this.query).subscribe(
  //     (response) => {
  //       this.countrydatabasedata = response;
  //       console.log(this.countrydatabasedata);

  //       this.loading = false;
  //     },
  //     (error) => {
  //       console.error(error);
  //       this.loading = false;
  //     }
  //   );
  // }

  search(query: any) {
    this.loading = true;

    if (!query) {
      // No search query provided, fetch all data
      this._country.getcountryData(query).subscribe(
        (response) => {
          this.countrydatabasedata = response;
          console.log(this.countrydatabasedata);
          this.loading = false;
        },
        (error) => {
          console.error(error);
          this.loading = false;
        }
      );
    } else {
      // Perform the search query
      this._country.getcountryData(query).subscribe(
        (response) => {
          this.countrydatabasedata = response;
          console.log(this.countrydatabasedata);
          this.loading = false;
        },
        (error) => {
          console.error(error);
          this.loading = false;
        }
      );
    }
  }

}

