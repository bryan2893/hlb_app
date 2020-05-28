import { Component, OnInit } from '@angular/core';

import {ExternalDbService as ServicioManteTrampasAmarillasDbExterna} from '../services/mantenimiento_trampas/external-db.service';

import {ExternalDbService as ServicioManteHlbDbExterna} from '../services/mantenimientos_hlb/external-db.service';

import {LocalDbService as ServicioManteHlbDbInterna} from '../services/mantenimientos_hlb/local-db.service';

import {LocalDbService as ServicioManteTrampasAmarillasDbInterna} from '../services/mantenimiento_trampas/local-db.service';

import {LoaderService} from '../services/loader.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  constructor(
    private loaderService: LoaderService,
    private localDb: ServicioManteTrampasAmarillasDbInterna,
    private servicioManteTrampasDbExterna:ServicioManteTrampasAmarillasDbExterna,
    private servicioHlbDbInterna:ServicioManteHlbDbInterna,
    private servicioManteHlbDbExterna:ServicioManteHlbDbExterna
    ) { }

  ngOnInit() {}

  async sincronizar(){

    try{
      const loading = await this.loaderService.showLoader();
      await loading.present();
      let trapsMantains = await this.servicioManteTrampasDbExterna.get_fake_Traps_Mantain();
      let hlbMantains = await this.servicioManteHlbDbExterna.get_fake_hlb_mantains();
      await this.localDb.insert_many_traps(trapsMantains);
      await this.servicioHlbDbInterna.insert_many_hlb_mantains(hlbMantains);
      await this.loaderService.hideLoader();
    }catch(error){
      await this.loaderService.hideLoader();
      alert(error.message);
    }
    
  }

}
