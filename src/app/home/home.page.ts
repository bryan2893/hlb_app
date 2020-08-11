import { Component } from '@angular/core';
import {UserLoged} from '../../DTO/UserLoged.dto';
import {Validators,FormBuilder,FormGroup, FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {UserLocalService} from '../services/user/user-local.service';
import {AlertService} from '../services/alert/alert.service';
import { UsuarioLocalDTO } from 'src/DTO/usuario/usuario-local.dto';
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

          let usuario:UsuarioLocalDTO = await this.userLocalService.getAUserByCredentials(username,password);
          //Loguear usuario en el servicio.
          userLogued = await this.userLocalService.buildUserLogued(usuario.user_id);

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
