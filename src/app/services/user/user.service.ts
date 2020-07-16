import { Injectable } from '@angular/core';
import { AlmacenamientoNativoService } from '../almacenamiento-interno/almacenamiento-nativo.service';
import {UserLoged} from '../../../DTO/UserLoged.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  logedUser:UserLoged;

  constructor(private almacenamientoNativoService:AlmacenamientoNativoService) { }

  createTable(){

  }

  getDefaultUser(){
    return new Promise((resolve,reject)=>{
      this.almacenamientoNativoService.obtenerUsuarioPorDefault().then((usuario:UserLoged)=>{
        resolve(usuario);
      }).catch((error)=>{
        reject(error);
      });
    });
  }

  setDefaultUser(user:UserLoged){
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
