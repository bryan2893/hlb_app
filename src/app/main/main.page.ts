import { Component, OnInit } from '@angular/core';
import {SincronizacionService} from '../services/sincronizacion.service';
import {LoaderService} from '../services/loader.service';
import {AlertService} from '../services/alert/alert.service';
import {ToastService} from '../services/toast-service/toast.service';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  constructor(private servicioDeSincronizacion:SincronizacionService,
              private loaderService:LoaderService,
              private alertService:AlertService,
              private toastService:ToastService,
              private router:Router,
              private authService:AuthService) { }

  ngOnInit() {}

  async sincronizar(){
    
    let loading:any;
    try{

      loading = await this.loaderService.showLoader("Sincronizando...");
      await loading.present();

      await this.servicioDeSincronizacion.sincronizarTodo();
      
      await loading.dismiss();
      let toast = await this.toastService.showToast("Sincronización completada!");
      toast.present();
    }catch(error){
      await loading.dismiss();
      let alert = await this.alertService.presentAlert(error);
      alert.present();
    }
    
  }

  async logOut(){
    let loadingElement = await this.loaderService.showLoader("Cerrando sesión...");
    await loadingElement.present();
    setTimeout(async ()=>{
      this.authService.logOutUser();
      await loadingElement.dismiss();
      this.router.navigate(['/']);
    },1500);
  }

}
