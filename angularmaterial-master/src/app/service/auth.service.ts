import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TIMEOUT_DURATION = 5000; // 30 seconds
  private logoutTimeout!: ReturnType<typeof setTimeout>;

  private registerUrl = "http://localhost:8080/admin/admindetails";
  private loginUrl = "http://localhost:8080/admin/loginadmindetails";

  constructor(private http: HttpClient , private _router: Router) { }
  registerUser(user: any) {
    console.log('hello');
    console.log(user);
    return this.http.post<any>(this.registerUrl, user);
  }

  loginUser(user: any) {
    console.log(user);
    return this.http.post<any>(this.loginUrl, user);
  }

  logoutUser() {
    localStorage.removeItem('token');
    this._router.navigate(['login']);
  }

  resetLogoutTimeout() {
    clearTimeout(this.logoutTimeout);
    this.logoutTimeout = setTimeout(() => {
      this.logoutUser();
    }, this.TIMEOUT_DURATION);
  }

  handleUserActivity() {
    this.resetLogoutTimeout();
    // Perform any other necessary actions based on user activity
  }

  handleUserInactivity() {
    // Perform any necessary actions when user is inactive
    this.logoutUser();
  }

  initializeTimeout() {
    this.logoutTimeout = setTimeout(() => {
      this.handleUserInactivity();
    }, this.TIMEOUT_DURATION);
  }

  startTrackingUserActivity() {
    window.addEventListener('mousemove', this.handleUserActivity.bind(this));
    window.addEventListener('keydown', this.handleUserActivity.bind(this));
    this.initializeTimeout();
  }

  stopTrackingUserActivity() {
    window.removeEventListener('mousemove', this.handleUserActivity.bind(this));
    window.removeEventListener('keydown', this.handleUserActivity.bind(this));
    clearTimeout(this.logoutTimeout);
  }
}
