import { Injectable } from '@angular/core';
import {Device} from '@ionic-native/device/ngx';
import {AuthService} from '../../services/auth/auth.service';
import {AlmacenamientoNativoService} from '../almacenamiento-interno/almacenamiento-nativo.service';

@Injectable({
  providedIn: 'root'
})
export class SyncInfoService {

  private appName = "App HLB";

  constructor(private device:Device,private authService:AuthService,
    private almacenamientoNativoService:AlmacenamientoNativoService) { }

  async getSyncInfo(){

    try{
      let parametrosConfiguracion:any = await this.almacenamientoNativoService.obtenerParametrosDeConfiguracion();
      let syncInf = {};
      syncInf["direccion_mac"] = this.device.uuid;
      syncInf["codigo_usuario"] = this.authService.getLogedUser().username;
      syncInf["nombre_aplicacion"] = this.appName;
      syncInf["version_aplicacion"] = parametrosConfiguracion.version;
      syncInf["fabricante_telefono"] = this.device.manufacturer;
      return syncInf;
    }catch(error){
      throw new Error(error.message);
    }
  }
}
