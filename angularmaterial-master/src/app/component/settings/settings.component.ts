import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SettingService } from 'src/app/service/setting.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent {


  driverrequestaccept: string[] = ['10', '20', '30', '40', '60', '90', '120'];

  location: string[] = ['1', '2', '3', '4', '5'];
  settingForm!: FormGroup;
  formBuilder: any;

  settingdata: any = {
    maximumstop: '',
    driverrequest: '',
  };
  locationvalue: any;
  driverrequestacceptvalue: any;
  settingdatabasedata: any;
  updatebuttonshow: boolean = false;
  addbuttonshow : boolean = false ;
  id: any;
  isshow : boolean = false ;
  addupdate: any

  constructor(private formbuilder: FormBuilder , private _settingService : SettingService ,   private toster: ToastrService,) {}

  ngOnInit() {
    this.settingForm = this.formbuilder.group({
      maximumstop: ['' , Validators.required],
      driverrequest: ['', Validators.required],
    });


    this._settingService.getsetting().subscribe((Response)=>{
      console.log(Response);
      this.settingdatabasedata = Response;

    })
  }

  onSelected(value: any) {
    //  console.log(value);
    this.locationvalue = value;
    console.log(this.locationvalue);
  }

  Onselecteddriverrequest(value: any) {
    this.driverrequestacceptvalue = value;
    console.log(this.driverrequestacceptvalue);
  }
  OnAddbuttonclick(){
    this.isshow = true ;
    this.addbuttonshow = true ;
    this.updatebuttonshow = false;
    this.settingForm.reset();
  }

  onupdatesetting(_id: string, setting: any) {
    console.log(_id);
    this.id = _id

    this.addbuttonshow = false;
    this.updatebuttonshow = true;

    this.settingForm.patchValue({
      maximumstop : setting.maximumstop,
      driverrequest : setting.driverrequest
    })
    }

  OnSubmit() {

    if(this.settingForm.invalid){
      this.settingForm.markAllAsTouched();
      return;
    }
    // const formValue = this.settingForm.value;
    const settingdata: any = {
      maximumstop: this.locationvalue,
      driverrequest: this.driverrequestacceptvalue,
    };


    if(this.addupdate){
      this._settingService.updatesetting(settingdata, this.id).subscribe({
        next: (res: any) => {
          let updateted = this.settingdatabasedata.find((obj: any) => {
            return obj._id === res._id
          })
          // console.log(updatetedVehicle);
          let key = Object.keys(updateted)

          key.forEach((key: any) => {
            updateted[key] = res[key]
          })
          this.settingForm.reset();
          this.toster.success(res.message);
          // let objToUpdate = this.vehicledatadfghjk.push(function (obj: any) {
          //   return obj._id == updateId})

        },
        error: (error) => {
          console.log(error.error.message);
          this.toster.warning(error.error.message)
        }
      });
    }else{
      this._settingService.addsetting(settingdata).subscribe({
        next: (res: any) => {
          this.settingdatabasedata.push(res.pricingdata);
          this.toster.success(res.message);
          this.settingForm.reset();
        },
        error: (error) => {
          console.log(error.error.message);
          this.toster.warning(error.error.message);
        }
      });
    }

  }



}
