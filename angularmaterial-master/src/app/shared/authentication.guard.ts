import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, CanActivateChild, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate , CanActivateChild {
constructor(private authentication : AuthenticationService ,private router : Router){}
  canActivate(): boolean {
      if (this.authentication.isLoggedIn()) {
        return true;
      }else{
        this.router.navigateByUrl('/login');
        this.authentication.deleteToken();
        return false;
      }
  }
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      if (this.authentication.isLoggedIn()) {
        return true;
      }else{
        this.router.navigateByUrl('/login');
        this.authentication.deleteToken();
        return false;
      }
    }
  }



