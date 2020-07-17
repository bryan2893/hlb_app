import { Component } from '@angular/core';
import {UserLoged} from '../../DTO/UserLoged.dto';
import {Validators,FormBuilder,FormGroup, FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {UserLocalService} from '../services/user/user-local.service';
import {AlertService} from '../services/alert/alert.service';
import { Usuario } from 'src/DTO/local/Usuario';
import {AuthService} from '../services/auth/auth.service';
import {LoaderService} from '../services/loader.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  loginForm: FormGroup;

  constructor(private router: Router,
    private userLocalService:UserLocalService,
    private formBuilder: FormBuilder,
    private alertService:AlertService,
    private authService:AuthService,
    private loaderService:LoaderService) {
      this.loginForm = this.formBuilder.group({
        username:['',Validators.required],
        password:['',Validators.required],
        type:['super',Validators.required]
      });
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
   
  }
  

  chooseUserType(event:any){
    //this.tipoLogueo = event.target.value;
  }

  async submit(){

    try{
      if(this.loginForm.dirty && this.loginForm.valid){

        let tipoLogueo = this.loginForm.controls['type'].value;
        let username = this.loginForm.controls['username'].value;
        let password = this.loginForm.controls['password'].value;
        let userLogued:UserLoged;

        if(tipoLogueo === "normal"){

          let usuario:Usuario = await this.userLocalService.getAUserByCredentials(username,password);
          //Loguear usuario en el servicio.
          userLogued = await this.userLocalService.buildUserLogued(usuario.usuario);

        }else{//es tipo "super"

          userLogued = await this.userLocalService.getDefaultUser();
          if(userLogued.username !== username || userLogued.password !== password){
            throw new Error("Credenciales no corresponden al super usuario!");
          }

        }

        this.authService.setLogedUser(userLogued);
        let loadingElement = await this.loaderService.showLoader("Iniciando sesión...");
        await loadingElement.present();
        setTimeout(async ()=>{
          await loadingElement.dismiss();
          console.log("Usuario logueado "+JSON.stringify(userLogued));
          this.router.navigate(['/main']);
        },1000);
        
      }else{
        let alert = await this.alertService.presentAlert("Credenciales son requeridas!");
        alert.present();
      }
    }catch(error){
      //Lanzar alert.
      let alert = await this.alertService.presentAlert(error);
      alert.present();
    }

    
  }
  
}
