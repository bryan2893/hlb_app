import { Component } from '@angular/core';
import {AuthService} from '../services/auth.service';
import User from '../../DTO/User.dto';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  formFields = {
    username: "",
    password: ""
  };

  constructor(private authService: AuthService,private router: Router) {}

  loginUser(){
    this.router.navigate(['/main']);
    /*
    this.authService.validateUser(this.formFields.username,this.formFields.password).then((user:User) => {
      //alert(JSON.stringify(user));
    }).catch((error) => {
      alert(error.message)
    });
    */
    
  }
  
}
