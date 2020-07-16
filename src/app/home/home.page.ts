import { Component } from '@angular/core';
import {UserLoged} from '../../DTO/UserLoged.dto';
import {Validators,FormBuilder,FormGroup, FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {UserLocalService} from '../services/user/user-local.service';
import {AlertService} from '../services/alert/alert.service';
import { Usuario } from 'src/DTO/local/Usuario';
import {AuthService} from '../services/auth/auth.service';

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
    private authService:AuthService) {
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

        let username = this.loginForm.controls['username'].value;
        let password = this.loginForm.controls['password'].value;
        let usuario:Usuario = await this.userLocalService.getAUserByCredentials(username,password);
        //Loguear usuario en el servicio.
        let userLogued:UserLoged = await this.userLocalService.buildUserLogued(usuario.usuario);
        
        console.log("El usuario logueado es "+ JSON.stringify(userLogued));

        this.authService.setLogedUser(userLogued);

        this.router.navigate(['/main']);
      }else{
        console.log("Credenciales son requeridas!");
      }
    }catch(error){
      //Lanzar alert.
      console.log("Hubo error en el login "+error);
    }

    
  }
  
}
