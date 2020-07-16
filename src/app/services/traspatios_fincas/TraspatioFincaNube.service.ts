import { Injectable } from '@angular/core';
import { HTTP,HTTPResponse } from '@ionic-native/http/ngx';
import {TraspatioFincaNubeSubida} from '../../../DTO/server/TraspatioFincaNubeSubida';
import {SyncInfoService} from '../syncInfo/sync-info.service';
import {Settings} from '../../../DTO/settings.dto';
import {AlmacenamientoNativoService} from '../../services/almacenamiento-interno/almacenamiento-nativo.service';

@Injectable({
  providedIn: 'root'
})
export class TraspatioFincaNubeService {

  private urlToDownload = '/api/traspatios_fincas/obtener_pagina/';
  private urlToUpload = '/api/traspatios_fincas/sincronizar';
  private urlToCountRecords = '/api/traspatios_fincas/contarRegistros/';

  constructor(private http: HTTP,private syncInfoService:SyncInfoService,
    private almacenamientoNativoService:AlmacenamientoNativoService) {
    this.http.setHeader('*', String("Accept"), String("application/json"));
    this.http.setDataSerializer('json');
  }
  
  getTraspatiosFincasPage(pageNumber:number,amountPerPage:number,pais:string){
    return new Promise((resolve,reject)=>{

      this.almacenamientoNativoService.obtenerParametrosDeConfiguracion().then((parametros:Settings)=>{

        let completedUrl = parametros.link_de_sincronizacion + this.urlToDownload + pageNumber + '/' + amountPerPage+'/'+pais;
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

  syncListOfTraspatiosFincas(listaDetraspatiosFincas:TraspatioFincaNubeSubida[]){
    return new Promise((resolve,reject)=>{

      this.almacenamientoNativoService.obtenerParametrosDeConfiguracion().then((parametros:Settings)=>{

        this.syncInfoService.getSyncInfo().then((info)=>{

          let paqueteDeSincronizacion = {
            registros:listaDetraspatiosFincas,
            informacionDeSincronizacion:[
              info
            ]
          };
    
          this.http.post(parametros.link_de_sincronizacion + this.urlToUpload, paqueteDeSincronizacion,{}).then((response:HTTPResponse) => {
            resolve(response);
          }).catch((error)=>{
            reject(JSON.stringify(error));
          });
  
        }).catch((error) =>{
          reject(error);
        });

      }).catch((error)=>{
        reject(error);
      });

    });
  }

  countRecords(pais:string){
    return new Promise((resolve,reject)=>{

      this.almacenamientoNativoService.obtenerParametrosDeConfiguracion().then((parametros:Settings)=>{

        this.http.get(parametros.link_de_sincronizacion+this.urlToCountRecords+'/'+pais,{},{}).then((response:HTTPResponse)=>{
          let respuestaTransformada = JSON.parse(response.data);
          resolve(respuestaTransformada[0].CANTIDAD);
        }).catch((e)=>{
          reject(e);
        });

      }).catch((error)=>{
        reject(error);
      });

    });
  }

  getPagesQuantity(rowsPerPage:number,pais:string){
    return new Promise((resolve,reject)=>{
      this.countRecords(pais).then((response:number)=>{
        let quantity = response;

        if(quantity === 0){
          resolve(0);
        }

        let divisionResiduo = quantity % rowsPerPage;
        let divsionEntera = Math.trunc(quantity / rowsPerPage);

        let num_paginas = divsionEntera;

        if(divisionResiduo > 0){
            num_paginas += 1;
        }

        resolve(num_paginas);
      }).catch((error:any)=>{
        reject(error);
      });
    });
  }

}
