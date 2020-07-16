import { Injectable } from '@angular/core';
import {UserLoged} from '../../../DTO/UserLoged.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  logedUser:UserLoged;

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

  setLogedUser(user:UserLoged){
    this.logedUser = user;
  }

  logOutUser(){
    this.logedUser = null;
  }
  
  getLogedUser(){
    return this.logedUser;
  }
  
}
