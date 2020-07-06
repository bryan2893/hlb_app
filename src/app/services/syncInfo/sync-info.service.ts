import { Injectable } from '@angular/core';
import {Device} from '@ionic-native/device/ngx';
import {UserService} from '../../services/user/user.service';
import {AlmacenamientoNativoService} from '../almacenamiento-interno/almacenamiento-nativo.service';

@Injectable({
  providedIn: 'root'
})
export class SyncInfoService {

  private appName = "App HLB";

  constructor(private device:Device,private userService:UserService,
    private almacenamientoNativoService:AlmacenamientoNativoService) { }

  async getSyncInfo(){

    try{
      let parametrosConfiguracion:any = await this.almacenamientoNativoService.obtenerParametrosDeConfiguracion();
      let syncInf = {};
      syncInf["direccion_mac"] = this.device.uuid;
      syncInf["codigo_usuario"] = this.userService.getLogedUser().username;
      syncInf["nombre_aplicacion"] = this.appName;
      syncInf["version_aplicacion"] = parametrosConfiguracion.version;
      syncInf["fabricante_telefono"] = this.device.manufacturer;
      return syncInf;
    }catch(error){
      throw new Error(error.message);
    }
  }
}
