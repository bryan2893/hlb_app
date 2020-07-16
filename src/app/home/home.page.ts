import { Component } from '@angular/core';
import {UserLoged} from '../../DTO/UserLoged.dto';
import {Router} from '@angular/router';
import {UserLocalService} from '../services/user/user-local.service';
import {AlertService} from '../services/alert/alert.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  username: "";
  password: "";
  tipoLogueo = "";


  constructor(private router: Router,
    private userLocalService:UserLocalService,
    private alertService:AlertService) {}
    
  todoLoNecesarioEstaCompleto(){
    return (this.username !== '' && this.password !== '' && this.tipoLogueo !== '');
  }

  loginUser(){

    /*
    if(this.todoLoNecesarioEstaCompleto()){
      if(this.tipoLogueo === 'super'){
        this.userService.getDefaultUserInfo().then((user:User)=>{

          console.log("Usuario recuperado en loguin "+JSON.stringify(user));

          if(user.username === this.username && user.password === this.password){
            this.userService.setLogedUser(user);
            alert("Se esta ingresado el siguiente usuario"+JSON.stringify(user));
            this.router.navigate(['/main']);
          }else{
            //Mostrar mensaje de error.
            this.alertService.presentAlert("Credenciales inválidas!").then((alert)=>{
              alert.present();
            });
          }
        }).catch((error)=>{
          //Mostrar mensaje de que algo salió mal.
          this.alertService.presentAlert(error).then((alert)=>{
            alert.present();
          });
        });
      }else{
        //hacer un loguin de un usuario normal.
      }
    }else{
      //Mostrar alert de error.
      this.alertService.presentAlert("Usuario, contraseña y el tipo de usuario no pueden quedar vacios!").then((alert)=>{
        alert.present();
      });
    }
    */
   this.router.navigate(['/main']);
  }
  

  chooseUserType(event:any){
    this.tipoLogueo = event.target.value;
  }
  
}
