import { Injectable } from '@angular/core';
import User from '../../DTO/User.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: User;

  constructor() { }

  validateUser(username,password){
    return new Promise((resolve,reject) => {
      if (username === "" || password === ""){
        reject(new Error("Error: Credenciales incompletas!"));
      }
      this.currentUser = {fullName:"Kendall Nájera Vindas",username:"knajera",permissions:["agregar","editar","leer"]};
      //para efectos de probar la aplicaciion siempre se retornará este usuario
      resolve(this.currentUser);
    });
  }

  isLoggedIn(){
    return this.currentUser !== null;
  }

  haveWritePermission(){
    //buscar si tiene el permiso de escritura en la lista de permisos y retornar true o false.
  }

  haveReadPermisions(){
    
  }

  haveUpdatePermission(){

  }

  haveAllPrivileges(){

  }

}
