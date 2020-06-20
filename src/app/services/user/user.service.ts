import { Injectable } from '@angular/core';
import { AlmacenamientoNativoService } from '../almacenamiento-interno/almacenamiento-nativo.service';
import {User} from '../../../DTO/User.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  logedUser:User;

  constructor(private almacenamientoNativoService:AlmacenamientoNativoService) { }

  getDefaultUserInfo(){
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
