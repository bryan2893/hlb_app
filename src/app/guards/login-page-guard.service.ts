import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import {AuthService} from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginPageGuardService implements CanActivate{

  constructor(private router:Router,private authService:AuthService) { }

  canActivate(route:ActivatedRouteSnapshot):boolean{
    
    if(!this.authService.isLogued()){
      return true;
    }
    return false;
  }
}
