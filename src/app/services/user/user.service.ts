import { Injectable } from '@angular/core';
import { AlmacenamientoNativoService } from '../almacenamiento-interno/almacenamiento-nativo.service';
import {User} from '../../../DTO/User.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  logedUser:User;

  constructor(private almacenamientoNativoService:AlmacenamientoNativoService) { }

  createTable(){

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

  findUser(){
    
  }

}
