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
    try{
      await this.loaderService.showLoader();
      await this.servicioDeSincronizacion.sincronizarTodo();
      await this.loaderService.hideLoader();
      alert('sincronización completada!');
    }catch(error){
      await this.loaderService.hideLoader();
      alert(error.message);
    }
  }

}
