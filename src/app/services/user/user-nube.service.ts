import { Injectable } from '@angular/core';
import { HTTP,HTTPResponse } from '@ionic-native/http/ngx';
import {Settings} from '../../../DTO/settings.dto';
import {AlmacenamientoNativoService} from '../../services/almacenamiento-interno/almacenamiento-nativo.service';

@Injectable({
  providedIn: 'root'
})
export class UserNubeService {

  private urlToDownload = '/api/usuarios/todo';

  constructor(private almacenamientoNativoService:AlmacenamientoNativoService,
    private http:HTTP) { 
      this.http.setHeader('*', String("Accept"), String("application/json"));
      this.http.setDataSerializer('json');
    }

  getUsuarios():Promise<HTTPResponse>{
    return new Promise((resolve,reject)=>{

      this.almacenamientoNativoService.obtenerParametrosDeConfiguracion().then((parametros:Settings)=>{

        let completedUrl = parametros.link_de_sincronizacion + this.urlToDownload;
        this.http.get(completedUrl,{},{}).then((response:HTTPResponse)=>{
          resolve(response);
        }).catch((e)=>{
          reject(e);
        });
      }).catch((error) => {
        reject(error);
      });

    });
  }

}
