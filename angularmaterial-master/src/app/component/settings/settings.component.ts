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
  id: any;
  addupdate: any;
  maximumstop: any;

  constructor(
    private formbuilder: FormBuilder,
    private _settingService: SettingService,
    private toster: ToastrService
  ) {}

  ngOnInit() {
    this.getsettingdata();
    this.settingForm = this.formbuilder.group({
      maximumstop: ['', Validators.required],
      driverrequest: ['', Validators.required],
      assountsid:[''],
      authtoken : [''],
      emailusername:['',],
      emailpassword : [''],
      publickey : [''],
      secreatkey : ['']

    });
  }

  getsettingdata() {
    this._settingService.getsetting().subscribe((Response) => {
      console.log(Response);
      this.settingdatabasedata = Response[0];
      console.log(this.settingdatabasedata);

      this.settingForm.patchValue({
        maximumstop: this.settingdatabasedata.maximumstop,
        driverrequest: this.settingdatabasedata.driverrequest,
        assountsid: this.settingdatabasedata.assountsid,
        authtoken :this.settingdatabasedata.authtoken,
        emailusername:this.settingdatabasedata.emailusername,
        emailpassword :this.settingdatabasedata.emailpassword,
        publickey: this.settingdatabasedata.publickey,
        secreatkey:this.settingdatabasedata.secreatkey,
      });
    });
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


  OnSubmit() {
    if (this.settingForm.invalid) {
      this.settingForm.markAllAsTouched();
      return;
    }
    console.log(this.locationvalue , this.driverrequestacceptvalue );

    const formValue = this.settingForm.value;
    const settingdata: any = {
      maximumstop: this.locationvalue,
      driverrequest: this.driverrequestacceptvalue,
      assountsid: formValue.assountsid,
      authtoken: formValue.authtoken,
      emailpassword : formValue.emailpassword,
      emailusername:formValue.emailusername,
      publickey:formValue.publickey,
      secreatkey:formValue.secreatkey
    };

    this._settingService.updatesetting(settingdata).subscribe({
      next: (res: any) => {
        this.getsettingdata();
        this.toster.success('update setting succesfull');
      },
      error: (error) => {
        console.log(error.error.message);
        this.toster.warning(error.error.message);
      },
    });
  }
}
