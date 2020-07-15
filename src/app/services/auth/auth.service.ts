import { Injectable } from '@angular/core';
import {User} from '../../../DTO/User.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  logedUser:User;

  constructor() {}

  //indica si hay un usuario autenticado.
  isLogued(){
    if (this.logedUser){
      return true;
    }
    return false;
  }

  logedUserhavePermission(permision:string){
    for(let i = 0;i<this.logedUser.actions.length;i++){
      let e:string = this.logedUser.actions[i];
      if(permision === e){
        return true;
      }
    }
    return false;
  }

  setLogedUser(user:User){
    this.logedUser = user;
  }

  logOutUser(){
    this.logedUser = null;
  }
  
  getLogedUser(){
    return this.logedUser;
  }
  
}
