import { Component, OnInit } from '@angular/core';
import {SincronizacionService} from '../services/sincronizacion.service';
import {LoaderService} from '../services/loader.service';
import {AlertService} from '../services/alert/alert.service';
import {ToastService} from '../services/toast-service/toast.service';

import {GpsService} from '../services/gps/gps.service';

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
              private gpsService:GpsService) { }

  ngOnInit() {}

  async sincronizarPrueba(){
    
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
      let alert = await this.alertService.presentAlert(JSON.stringify(error));
      alert.present();
    }
    
  }

}
