import { Component, OnInit } from '@angular/core';
import {SincronizacionService} from '../services/sincronizacion.service';
import {LoaderService} from '../services/loader.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  constructor(private servicioDeSincronizacion:SincronizacionService,private loaderService:LoaderService) { }

  ngOnInit() {}

  async sincronizarPrueba(){
    let loading:any;
    try{

      loading = await this.loaderService.showLoader("Sincronizando...");
      await loading.present();

      await this.servicioDeSincronizacion.sincronizarTodo();
      
      await loading.dismiss();
    }catch(error){
      //await this.loaderService.hideLoader();
      await loading.dismiss();
      alert(JSON.stringify(error));
    }
    
  }

}
