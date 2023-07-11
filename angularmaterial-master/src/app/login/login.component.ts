import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],

})
export class LoginComponent {
  Loginform!: FormGroup;
  submitted = false;
  constructor(private formBuilder: FormBuilder, private _auth: AuthService , private _router : Router, private toster: ToastrService)  {}

  ngOnInit() {
    this.Loginform = this.formBuilder.group({
      // uname: ['', Validators.required ],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  OnSubmit() {
    if(this.Loginform.invalid){
      this.Loginform.markAllAsTouched();
      return;
    }
    this._auth.loginUser(this.Loginform.value).subscribe((res) => {
      console.log(res);
      if(!res.success){
        // console.log("fghjklkjhg");
        // alert(res.message)
        this.toster.warning(res.message)
      }else{
        localStorage.setItem('token', res.token);
      // this._router.navigate(['/menubar'])
      this.submitted = true;
      if (this.Loginform.invalid) {
        return ;
      }else{
        this._router.navigate(['/menubar'])
      // alert('success');
      this.toster.success("success")

      }
      }
      // localStorage.setItem('token', res.token);
      // this._router.navigate(['/menubar'])
    });
  }
}
