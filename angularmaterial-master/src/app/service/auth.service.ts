import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private registerUrl = "http://localhost:8080/admin/admindetails";
  private loginUrl = "http://localhost:8080/admin/loginadmindetails";

  constructor(private http: HttpClient , private _router: Router) { }

  registerUser(user : any ){
    console.log("hello");
    console.log(user);
    return this.http.post<any>(this.registerUrl , user);
  }

  loginUser(user:any){
    console.log(user);
    return this.http.post<any>(this.loginUrl , user);
  }

  logoutUser(){
    localStorage.removeItem('token');
    this._router.navigate(['login'])
  }
}
