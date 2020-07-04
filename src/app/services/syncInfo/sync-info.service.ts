import { Injectable } from '@angular/core';
import {Device} from '@ionic-native/device/ngx';
import {UserService} from '../../services/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class SyncInfoService {

  private appName = "App HLB";
  private appVersion = "1.1";

  constructor(private device:Device,private userService:UserService) { }

  getSyncInfo(){
      let syncInfo = {};
      syncInfo["direccion_mac"] = this.device.uuid;
      syncInfo["codigo_usuario"] = this.userService.getLogedUser().username;
      syncInfo["nombre_aplicacion"] = this.appName;
      syncInfo["version_aplicacion"] = this.appVersion;
      syncInfo["fabricante_telefono"] = this.device.manufacturer;
      return syncInfo;
  }
}
