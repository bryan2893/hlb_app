import { Injectable } from '@angular/core';
import { AlmacenamientoNativoService } from '../almacenamiento-interno/almacenamiento-nativo.service';
import {User} from '../../../DTO/User.dto';
import {ACTIONS} from '../../../constants/user_actions';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  logedUser:User;

  constructor(private almacenamientoNativoService:AlmacenamientoNativoService) { }

  private findElement(element:string,array:string[]){
    for(let i = 0;i<array.length;i++){
      let e:string = array[i];
      if(element === e){
        return true;
      }
    }
    return false;
  }

  getDefaultUser(){
    return new Promise((resolve,reject)=>{
      this.almacenamientoNativoService.obtenerUsuarioPorDefault().then((usuario:User)=>{
        resolve(usuario);
      }).catch((error)=>{
        reject(error);
      });
    });
  }

  setDefaultUser(user:User){
    return new Promise((resolve,reject)=>{
      this.almacenamientoNativoService.almacenarUsuarioPorDefault(user).then((user)=>{
        resolve(user);
      }).catch((error)=>{
        reject(error);
      });
    });
  }

  //indica si hay un usuario loautenticado.
  isLogued(){
    if (this.logedUser){
      return true;
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
