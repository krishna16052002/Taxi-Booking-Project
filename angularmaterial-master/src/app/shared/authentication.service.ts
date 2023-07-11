import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor() {}
  isLoggedIn() {
    if (localStorage.getItem('token')) {
      return true;
    } else {
      return false;
    }
    // return !localStorage.getItem('token');
  }
  deleteToken() {
    localStorage.removeItem('token');
  }
}
