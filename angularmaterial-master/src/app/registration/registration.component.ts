import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent {
  registerForm!: FormGroup;
  submitted = false;
  constructor(
    private formBuilder: FormBuilder,
    private _auth: AuthService,
    private _router: Router
  ) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      adminname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  OnSubmit() {

    if(this.registerForm.invalid){
      this.registerForm.markAllAsTouched();
      return;
    }
    // this._auth.registerUser(this.registerForm).subscribe(
    //   res => console.log(res),
    //   err => console.log(err)
    // )
    this._auth.registerUser(this.registerForm.value).subscribe((res) => {
      console.log(res);
      this._router.navigate(['/login']);
      // localStorage.setItem('token', res.token);
    });
    this.submitted = true;
    if (this.registerForm.invalid) {
      return alert('all value valid required ');
    }
    alert('success');
    // console.log(this.registerForm);
  }

  // registerUser(){
  //   this._auth.registerUser(this.registerForm).subscribe(
  //     res => console.log(res),
  //     err => console.log(err)
  //   )
  // }
}
