import { Injectable } from '@angular/core';
import {ACTIONS} from '../../../constants/user_actions';
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

  private findElement(element:string,array:string[]){
    for(let i = 0;i<array.length;i++){
      let e:string = array[i];
      if(element === e){
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

  private canAdd(){
    if(this.logedUser){
      return this.findElement(ACTIONS.ADD,this.logedUser.actions);
    }
    return false;
  }

  private candRead(){
    if(this.logedUser){
      return this.findElement(ACTIONS.READ,this.logedUser.actions);
    }
    return false;
  }

  private canUpdate(){
    if(this.logedUser){
      return this.findElement(ACTIONS.UPDATE,this.logedUser.actions);
    }
    return false;
  }

  private canMakeConfig(){
    if(this.logedUser){
      return this.findElement(ACTIONS.DELETE,this.logedUser.actions);
    }
    return false;
  }

  isSuperUserType(){
    return this.canAdd() && this.candRead() && this.canUpdate() && this.canMakeConfig();
  }

  isInspectorType(){
    return this.canAdd() && this.candRead();
  }

  isConfirmerType(){
    return this.canAdd() && this.candRead() && this.canUpdate();
  }

  

}
